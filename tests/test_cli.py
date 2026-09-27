from __future__ import annotations

import json
import os
import pathlib
import subprocess
import tempfile
import unittest
from contextlib import contextmanager
from unittest import mock

from ripple import cli
from ripple.auth import auth_status, get_github_token, store_github_token
from ripple.config import (
    detect_github_repo,
    get_config_file,
    get_github_branch,
    get_github_repo,
    get_health_url,
)
from server.tools.docs_tools import search_project_docs
from server.tools.git_tools import get_recent_changes
from server.tools.github_tools import create_pull_request


@contextmanager
def working_directory(path: pathlib.Path):
    previous = pathlib.Path.cwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(previous)


def git(cwd: pathlib.Path, *args: str) -> None:
    subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True, text=True)


class RippleCliTests(unittest.TestCase):
    def make_repo(self, root: pathlib.Path) -> None:
        git(root, "init", "-b", "feature/test")
        git(root, "config", "user.name", "Ripple Test")
        git(root, "config", "user.email", "ripple@example.invalid")
        (root / "README.md").write_text("# External project\n", encoding="utf-8")
        git(root, "add", "README.md")
        git(root, "commit", "-m", "initial")
        git(root, "remote", "add", "origin", "git@github.com:example/external-project.git")

    def test_init_creates_project_config_and_preserves_other_mcp_servers(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            self.make_repo(root)
            bob_file = root / ".bob" / "mcp.json"
            bob_file.parent.mkdir()
            bob_file.write_text(
                json.dumps({"mcpServers": {"other": {"command": "other-server"}}}),
                encoding="utf-8",
            )

            with working_directory(root), mock.patch(
                "ripple.auth.is_github_authenticated", return_value=False
            ):
                cli.cmd_init()

            config = json.loads((root / ".ripple" / "config.json").read_text())
            self.assertEqual(config["github_repo"], "example/external-project")
            self.assertEqual(config["branch"], "feature/test")
            bob = json.loads(bob_file.read_text())
            self.assertEqual(bob["mcpServers"]["other"], {"command": "other-server"})
            ripple_entry = bob["mcpServers"]["ripple"]
            self.assertEqual(ripple_entry["command"], "ripple")
            self.assertEqual(ripple_entry["args"], ["serve"])
            # RIPPLE_PROJECT_ROOT must point at the temp project directory
            self.assertEqual(
                ripple_entry["env"]["RIPPLE_PROJECT_ROOT"],
                str(root.resolve()),
            )
            # RIPPLE_GITHUB_REPO is populated from the detected remote
            self.assertEqual(
                ripple_entry["env"]["RIPPLE_GITHUB_REPO"],
                "example/external-project",
            )

    def test_config_is_resolved_from_git_root_when_run_in_subdirectory(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            self.make_repo(root)
            nested = root / "src" / "package"
            nested.mkdir(parents=True)
            with working_directory(nested):
                cli.cmd_init()
                self.assertEqual(get_config_file(), root / ".ripple" / "config.json")
            self.assertFalse((nested / ".ripple").exists())

    def test_tools_read_the_external_current_project(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            self.make_repo(root)
            docs = root / "docs"
            docs.mkdir()
            (docs / "runbook.md").write_text(
                "# Recovery\nSet EXTERNAL_DATABASE_URL before restart.\n", encoding="utf-8"
            )
            with working_directory(root):
                changes = get_recent_changes()
                results = search_project_docs("EXTERNAL_DATABASE_URL")
            self.assertEqual(changes["message"], "initial")
            self.assertEqual(results["results"][0]["file"], "runbook.md")

    def test_environment_overrides_project_config(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            self.make_repo(root)
            (root / ".ripple").mkdir()
            (root / ".ripple" / "config.json").write_text(
                json.dumps(
                    {
                        "github_repo": "config/repo",
                        "branch": "config-branch",
                        "health_url": "http://config.invalid/health",
                    }
                ),
                encoding="utf-8",
            )
            env = {
                "RIPPLE_GITHUB_REPO": "env/repo",
                "RIPPLE_GITHUB_BRANCH": "env-branch",
                "RIPPLE_HEALTH_URL": "http://env.invalid/health",
            }
            with working_directory(root), mock.patch.dict(os.environ, env, clear=False):
                self.assertEqual(get_github_repo(), "env/repo")
                self.assertEqual(get_github_branch(), "env-branch")
                self.assertEqual(get_health_url(), "http://env.invalid/health")

    def test_create_pull_request_reports_required_auth_message(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            with working_directory(root), mock.patch.dict(os.environ, {}, clear=True), mock.patch(
                "ripple.auth._auth_file", return_value=root / "missing-auth.json"
            ):
                result = create_pull_request("Title", "Body")
            self.assertEqual(
                result["error"],
                "GitHub authentication required. Run `ripple auth github`.",
            )

    def test_auth_storage_is_private_and_status_never_exposes_token(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            config_home = pathlib.Path(temp)
            with mock.patch.dict(
                os.environ, {"XDG_CONFIG_HOME": str(config_home)}, clear=True
            ):
                store_github_token("github_pat_secret-value")
                auth_file = config_home / "ripple" / "auth.json"
                self.assertEqual(auth_file.stat().st_mode & 0o777, 0o600)
                self.assertEqual(get_github_token(), "github_pat_secret-value")
                status = auth_status()
                self.assertTrue(status["configured"])
                self.assertNotIn("github_pat_secret-value", json.dumps(status))
                self.assertNotIn("token_prefix", status)

    def test_detects_https_and_ssh_github_remotes(self) -> None:
        for remote in (
            "git@github.com:owner/repository.git",
            "https://github.com/owner/repository.git",
            "ssh://git@github.com/owner/repository.git",
        ):
            with self.subTest(remote=remote), tempfile.TemporaryDirectory() as temp:
                root = pathlib.Path(temp)
                git(root, "init")
                git(root, "remote", "add", "origin", remote)
                with working_directory(root):
                    self.assertEqual(detect_github_repo(), "owner/repository")


if __name__ == "__main__":
    unittest.main()
