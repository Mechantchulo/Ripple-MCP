# Runbook

## Operational Troubleshooting Guide

---

## Database Unavailable

**Symptom:** The application health endpoint returns `{"status": "degraded", "database": "unavailable"}` or CI health-check stage is failing with a database connection error.

**Troubleshooting steps:**

1. **Verify `DATABASE_URL` is configured.**
   Check that the `DATABASE_URL` environment variable is set in the running environment. See [configuration.md](configuration.md) for the expected format.

2. **Verify the running application still reads `DATABASE_URL`.**
   Review the application's database initialisation code. Confirm it references `DATABASE_URL` exactly — not a renamed or alternative variable. A recent code change may have altered the expected variable name.

3. **Review recent configuration-related Git changes.**
   Use `get_recent_changes` to inspect the latest commits. Look for changes to any file that reads environment variables (e.g. `database.py`, `config.py`, `settings.py`, `main.py`). A variable rename or removal in a recent commit is a common cause of this failure.

4. **Review CI status.**
   Use `get_ci_status` to check whether the health-check stage in CI is also failing. If it is, the failure is reproducible from a clean environment and is not an infrastructure issue.

5. **Review the latest deployment record.**
   Use `get_deployment_info` to confirm which version is deployed and whether the deployment health check already reported a failure at deploy time.

6. **Check the application health endpoint directly.**
   Use `check_service_health` to retrieve the current live health status. Compare the response with the deployment record and CI status to determine whether the failure is new or has persisted since the last deployment.

---

## Application Unreachable

**Symptom:** `check_service_health` returns `{"reachable": false, "status": "unreachable"}`.

**Troubleshooting steps:**

1. Verify the application process is running.
2. Confirm the application is bound to the expected address (default: `http://127.0.0.1:8000`).
3. Check `RIPPLE_HEALTH_URL` in `.env` to ensure it points to the correct host and port.
4. Review recent Git changes for modifications to the server startup configuration.

---

## CI Pipeline Failing

**Symptom:** `get_ci_status` returns `{"status": "failing"}`.

**Troubleshooting steps:**

1. Check which stage is failing using the `stages` array in the CI status response.
2. If the **lint** stage is failing: review recent code style changes.
3. If the **tests** stage is failing: run the test suite locally and review the failure output.
4. If the **health-check** stage is failing: follow the [Database Unavailable](#database-unavailable) steps above — this is the most common cause.

---

## Deployment Degraded

**Symptom:** `get_deployment_info` returns `{"status": "degraded", "health_check": "failed"}`.

**Troubleshooting steps:**

1. Note the `version` field from the deployment record.
2. Use `get_ci_status` to check whether CI was already failing for that commit.
3. Use `check_service_health` to get the current live health status.
4. If the health endpoint confirms the database is unavailable, follow the [Database Unavailable](#database-unavailable) steps above.
5. If CI was passing but the deployment is still degraded, review environment-specific configuration in the deployment environment.

---

## Configuration Reference

For full environment variable documentation, see [configuration.md](configuration.md).

For architecture and component relationships, see [architecture.md](architecture.md).
