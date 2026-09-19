"""Health check probe script for ClausaFractalAI subsystems."""

import sys
import httpx


def check_subsystems() -> bool:
    """Probe the backend API liveness and readiness.

    Returns:
        bool: True if all health probes return 200 OK, False otherwise.
    """
    url = "http://127.0.0.1:8000/health"
    print(f"Probing {url}...")
    try:
        response = httpx.get(url, timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: {data.get('app')} is {data.get('status')} (v{data.get('version')})")
            return True
        else:
            print(f"FAILURE: Health check returned HTTP {response.status_code}")
            return False
    except Exception as exc:
        print(f"ERROR connecting to backend service: {exc}")
        return False


if __name__ == "__main__":
    success = check_subsystems()
    sys.exit(0 if success else 1)
