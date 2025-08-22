import os
from typing import Dict, Any

import google.generativeai as genai


def _get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")
    genai.configure(api_key=api_key)
    # Use a sensible default model; can be overridden later if needed
    return genai.GenerativeModel("gemini-1.5-flash")


def get_ai_explanation(system_output: Dict[str, Any]) -> str:
    """
    Generates an explanation for the system behavior using Google Gemini.
    Expects metrics like overshoot, settling_time, rise_time, etc. in system_output.
    """
    model = _get_gemini_client()

    prompt = (
        "You are a control systems tutor. Given the simulation metrics below, explain the system's "
        "behavior in concise, user-friendly terms, and suggest how to tune PID (Kp, Ki, Kd).\n\n"
        f"Metrics JSON: {system_output}\n\n"
        "Keep it under 120 words."
    )

    try:
        resp = model.generate_content(prompt)
        text = getattr(resp, "text", None)
        if not text and hasattr(resp, "candidates") and resp.candidates:
            # Fallback if SDK shape differs
            text = resp.candidates[0].content.parts[0].text  # type: ignore[attr-defined]
        return text or "Unable to generate explanation at this time."
    except Exception as e:
        return f"AI explanation error: {e}"
