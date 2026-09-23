"""Static security and secret scan for frontend codebase."""
import os
import re
import sys

PATTERNS = [
    ("Generic Secret/Token", re.compile(r"""(?i)(api[_-]?key|secret|password|auth[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-\.]{12,}['"]""")),
    ("Google API Key", re.compile(r"""AIza[0-9A-Za-z\-_]{35}""")),
    ("Private Key", re.compile(r"""-----BEGIN [A-Z ]+ PRIVATE KEY-----""")),
    ("Dangerous eval()", re.compile(r"""\beval\s*\(""")),
    ("Dangerous innerHTML without sanitize", re.compile(r"""dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html:\s*(?!(DOMPurify|sanitize))""")),
]

findings = []
scan_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "frontend", "src")
scan_dir = os.path.abspath("frontend/src")

for root, _, files in os.walk(scan_dir):
    for f in files:
        if f.endswith(('.ts', '.tsx', '.js', '.jsx', '.html')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                for line_no, line in enumerate(fp, 1):
                    # Skip test mock strings
                    if "tests" in path and ("mock" in line.lower() or "bearer test" in line.lower()):
                        continue
                    for label, pat in PATTERNS:
                        if pat.search(line):
                            findings.append((label, os.path.relpath(path), line_no, line.strip()))

if findings:
    print(f"FAILED: Found {len(findings)} potential security findings:")
    for label, p, l, text in findings:
        print(f"[{label}] {p}:{l} -> {text[:90]}")
    sys.exit(1)
else:
    print("SUCCESS: 0 security vulnerabilities, secrets, or dangerous injection patterns found in frontend/src.")
    sys.exit(0)
