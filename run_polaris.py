import os
import sys
import uvicorn

if __name__ == "__main__":
    print("=" * 65)
    print("  ❄️ POLARIS – AI-Powered Polar Energy Intelligence System")
    print("=" * 65)
    print("  Local Access URL:    http://localhost:8008")
    print("  Network Access URL:  http://0.0.0.0:8008")
    print("=" * 65)
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8008, reload=False)
