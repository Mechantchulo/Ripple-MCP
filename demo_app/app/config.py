"""
config.py — Demo application configuration.

Reads all runtime settings from environment variables.
Intentional simplicity: the variable name here is the single source of truth
for the database config — a rename here IS the breaking change for the demo.
"""

import os

# The application expects DATABASE_URL to be set in the environment.
# If this variable is absent or empty, the app starts but /health reports degraded.
#
# DEMO BREAKAGE POINT: changing os.getenv("DATABASE_URL") to os.getenv("DB_URL")
# while the environment still provides DATABASE_URL is the intentional incident.
DATABASE_URL: str | None = os.getenv("DB_URL")
