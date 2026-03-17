import httpx
import time

print("Sending request to PDF endpoint...")
start = time.time()

try:
    r = httpx.post(
        "http://localhost:8000/pdf/generate",
        json={"html": "<html><body><h1>Test Resume</h1><p>Hello</p></body></html>"},
        timeout=120,
    )
    elapsed = time.time() - start
    print(f"Status: {r.status_code} ({elapsed:.1f}s)")

    if r.status_code == 200:
        print(f"PDF Size: {len(r.content)} bytes - SUCCESS!")
    else:
        print(f"Error: {r.text}")
except Exception as e:
    elapsed = time.time() - start
    print(f"Request failed after {elapsed:.1f}s: {e}")
