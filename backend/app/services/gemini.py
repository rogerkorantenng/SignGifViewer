import google.generativeai as genai
from PIL import Image
import io
import json
import re
from typing import Optional

from app.config import get_settings

# Global model instance
_model: Optional[genai.GenerativeModel] = None


def init_gemini(api_key: str) -> None:
    """Initialize the Gemini API client."""
    global _model
    genai.configure(api_key=api_key)
    settings = get_settings()
    _model = genai.GenerativeModel(settings.gemini_model)


def get_model() -> genai.GenerativeModel:
    """Get the Gemini model instance."""
    global _model
    if _model is None:
        settings = get_settings()
        if not settings.gemini_api_key:
            raise ValueError("Gemini API key not configured")
        init_gemini(settings.gemini_api_key)
    return _model


async def translate_sign_language(
    image: Image.Image,
    language: str = "ASL",
) -> dict:
    """
    Translate sign language from an image using Gemini 3.

    Args:
        image: PIL Image containing sign language gesture
        language: Sign language type (ASL, BSL, etc.)

    Returns:
        Dictionary with text, confidence, and raw_response
    """
    model = get_model()

    prompt = f"""You are an expert sign language interpreter specializing in {language} (American Sign Language if ASL, British Sign Language if BSL).

Analyze this image and identify any sign language gestures being made.

Instructions:
1. Look for hand shapes, positions, and movements
2. Consider facial expressions if visible (they're part of sign language grammar)
3. If you can identify a sign, provide the English translation
4. If no clear sign is visible or the image doesn't show sign language, respond with "NO_SIGN_DETECTED"

Respond in this exact JSON format:
{{
    "detected": true/false,
    "text": "the translated word or phrase",
    "confidence": 0.0-1.0,
    "description": "brief description of the hand position/gesture"
}}

Only respond with the JSON, no other text."""

    try:
        response = model.generate_content([prompt, image])
        response_text = response.text.strip()

        # Try to parse JSON from response
        try:
            # Handle markdown code blocks
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()

            result = json.loads(response_text)

            if not result.get("detected", False) or result.get("text") == "NO_SIGN_DETECTED":
                return {
                    "text": "",
                    "confidence": 0.0,
                    "raw_response": response_text,
                }

            return {
                "text": result.get("text", ""),
                "confidence": float(result.get("confidence", 0.5)),
                "raw_response": response_text,
            }

        except json.JSONDecodeError:
            # Fallback: try to extract meaning from plain text
            if "NO_SIGN_DETECTED" in response_text.upper():
                return {
                    "text": "",
                    "confidence": 0.0,
                    "raw_response": response_text,
                }

            return {
                "text": response_text[:100],  # Truncate if too long
                "confidence": 0.5,
                "raw_response": response_text,
            }

    except Exception as e:
        raise ValueError(f"Gemini API error: {str(e)}")


async def get_sign_guidance(
    text: str,
    language: str = "ASL",
) -> dict:
    """
    Get step-by-step guidance for signing text.

    Args:
        text: Text to convert to sign language
        language: Target sign language type

    Returns:
        Dictionary with steps and notes
    """
    model = get_model()

    prompt = f"""You are an expert {language} sign language instructor.

Provide detailed, step-by-step instructions for signing the following text:
"{text}"

For each word or concept, provide:
1. The step number
2. A clear description of how to form the sign
3. Hand position details
4. Any movement required

Respond in this exact JSON format:
{{
    "steps": [
        {{
            "step": 1,
            "description": "detailed instruction",
            "hand_position": "description of hand shape and position",
            "movement": "description of any movement required"
        }}
    ],
    "notes": "any additional tips or context"
}}

Only respond with the JSON, no other text."""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Parse JSON
        try:
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()

            result = json.loads(response_text)

            return {
                "steps": result.get("steps", []),
                "notes": result.get("notes"),
            }

        except json.JSONDecodeError:
            # Fallback: create basic response
            return {
                "steps": [
                    {
                        "step": 1,
                        "description": response_text,
                        "hand_position": "See description",
                        "movement": None,
                    }
                ],
                "notes": "Could not parse structured response",
            }

    except Exception as e:
        raise ValueError(f"Gemini API error: {str(e)}")


async def get_visual_sign_guidance(
    text: str,
    language: str = "ASL",
) -> dict:
    """
    Get detailed visual guidance for signing text, including video resource suggestions.

    Args:
        text: Text to convert to sign language
        language: Target sign language type

    Returns:
        Dictionary with steps, video resources, tips, and common mistakes
    """
    model = get_model()

    prompt = f"""You are an expert {language} sign language instructor specializing in visual teaching methods.

Provide detailed visual guidance for signing the following text:
"{text}"

For each word or concept, provide:
1. The exact word being signed
2. Clear description of how to make the sign
3. Hand shape (e.g., "flat hand", "fist", "index finger pointing")
4. Palm orientation (e.g., "palm facing down", "palm facing out")
5. Location where the sign is made (e.g., "in front of chest", "near forehead")
6. Any movement required
7. Facial expressions if needed (they're grammatically important in sign language)
8. A YouTube search query that would help find a video demonstration

Also provide:
- General tips for learning these signs
- Common mistakes beginners make

Respond in this exact JSON format:
{{
    "steps": [
        {{
            "step": 1,
            "word": "the word",
            "description": "detailed instruction on how to make the sign",
            "hand_shape": "description of hand shape",
            "palm_orientation": "direction palm faces",
            "location": "where the sign is made",
            "movement": "movement description or null",
            "facial_expression": "expression needed or null",
            "video_search_query": "ASL sign for [word]"
        }}
    ],
    "video_resources": [
        {{
            "title": "How to sign [word] in ASL",
            "url": "https://www.handspeak.com/word/[word]",
            "source": "HandSpeak"
        }},
        {{
            "title": "ASL [word] - ASL University",
            "url": "https://www.lifeprint.com/asl101/pages-signs/[first-letter]/[word].htm",
            "source": "Lifeprint"
        }}
    ],
    "tips": "helpful tips for learning these signs",
    "common_mistakes": "mistakes beginners often make"
}}

Only respond with the JSON, no other text."""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Parse JSON
        try:
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()

            result = json.loads(response_text)

            return {
                "steps": result.get("steps", []),
                "video_resources": result.get("video_resources", []),
                "tips": result.get("tips"),
                "common_mistakes": result.get("common_mistakes"),
            }

        except json.JSONDecodeError:
            # Fallback: create basic response
            return {
                "steps": [
                    {
                        "step": 1,
                        "word": text,
                        "description": response_text,
                        "hand_shape": "See description",
                        "palm_orientation": "See description",
                        "location": "See description",
                        "movement": None,
                        "facial_expression": None,
                        "video_search_query": f"ASL sign for {text}",
                    }
                ],
                "video_resources": [
                    {
                        "title": f"Search for '{text}' on HandSpeak",
                        "url": f"https://www.handspeak.com/word/search/index.php?id={text.replace(' ', '+')}",
                        "source": "HandSpeak",
                    }
                ],
                "tips": "Could not parse structured response",
                "common_mistakes": None,
            }

    except Exception as e:
        raise ValueError(f"Gemini API error: {str(e)}")


async def generate_hand_pose(
    sign: str,
    language: str = "ASL",
) -> dict:
    """
    Generate 3D hand pose data for a sign using Gemini.

    Args:
        sign: Word or letter to generate pose for
        language: Sign language type

    Returns:
        Dictionary with pose data and description
    """
    model = get_model()

    prompt = f"""You are an expert in {language} sign language and 3D hand modeling.

Generate precise 3D hand pose data for the sign: "{sign}"

Each finger has:
- curl: 0.0 (straight) to 1.0 (fully curled into palm)
- spread: -1.0 (spread inward) to 1.0 (spread outward)

The wrist_rotation is in radians:
- x: rotation around x-axis (tilting forward/back)
- y: rotation around y-axis (turning left/right)
- z: rotation around z-axis (twisting)

palm_direction: where the palm faces (forward, back, up, down, left, right)

Respond in this exact JSON format:
{{
    "pose": {{
        "thumb": {{"curl": 0.0, "spread": 0.5}},
        "index": {{"curl": 0.0, "spread": 0.0}},
        "middle": {{"curl": 0.0, "spread": 0.0}},
        "ring": {{"curl": 0.0, "spread": 0.0}},
        "pinky": {{"curl": 0.0, "spread": 0.0}},
        "wrist_rotation": {{"x": 0.0, "y": 0.0, "z": 0.0}},
        "palm_direction": "forward"
    }},
    "description": "Brief description of the hand position and how to form this sign"
}}

Be precise with the values to accurately represent the {language} sign for "{sign}".
Only respond with the JSON, no other text."""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Parse JSON
        try:
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()

            result = json.loads(response_text)

            return {
                "sign": sign,
                "pose": result.get("pose", {}),
                "description": result.get("description", ""),
            }

        except json.JSONDecodeError:
            # Fallback: return default pose
            return {
                "sign": sign,
                "pose": {
                    "thumb": {"curl": 0.2, "spread": 0.3},
                    "index": {"curl": 0.1, "spread": 0.0},
                    "middle": {"curl": 0.1, "spread": 0.0},
                    "ring": {"curl": 0.1, "spread": 0.0},
                    "pinky": {"curl": 0.1, "spread": 0.0},
                    "wrist_rotation": {"x": 0, "y": 0, "z": 0},
                    "palm_direction": "forward",
                },
                "description": "Default relaxed hand position. Could not parse specific pose.",
            }

    except Exception as e:
        raise ValueError(f"Gemini API error: {str(e)}")
