"""Test script for Gemini Enterprise Agent Platform models using google-genai SDK."""

import os
from google import genai

def test_models():
    project = os.environ.get("GOOGLE_CLOUD_PROJECT", "genai-apac-2026-491004")
    location = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
    
    print(f"Connecting to Gemini Enterprise Agent Platform (Vertex AI): project={project}, location={location}")
    
    client = genai.Client(vertexai=True, project=project, location=location)
    
    models = [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
    ]
    
    results = {}
    for model_name in models:
        print(f"Testing {model_name} ... ", end="", flush=True)
        try:
            response = client.models.generate_content(
                model=model_name,
                contents="Verify connection: respond with 'VERIFIED'.",
            )
            text = response.text.strip()
            print(f"SUCCESS: {text}")
            results[model_name] = True
        except Exception as exc:
            print(f"FAILED: {exc}")
            results[model_name] = False
            
    print("\nTest Summary:")
    for m, ok in results.items():
        print(f"  - {m}: {'READY' if ok else 'UNAVAILABLE'}")

if __name__ == "__main__":
    test_models()
