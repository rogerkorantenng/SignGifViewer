#!/usr/bin/env python3
"""Test script to verify Gemini API connection."""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import google.generativeai as genai

def test_gemini_connection():
    """Test the Gemini API connection."""
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in environment")
        return False

    print(f"API Key found: {api_key[:10]}...{api_key[-4:]}")

    try:
        # Configure the API
        genai.configure(api_key=api_key)

        # List available models
        print("\nAvailable models:")
        for model in genai.list_models():
            if "generateContent" in model.supported_generation_methods:
                print(f"  - {model.name}")

        # Test a simple generation with Gemini 3
        print("\nTesting text generation with Gemini 3...")
        model = genai.GenerativeModel("gemini-3-flash-preview")
        response = model.generate_content("Say 'Hello, SignBridge!' in a friendly way.")

        print(f"Response: {response.text}")
        print("\nGemini API connection successful!")
        return True

    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    test_gemini_connection()
