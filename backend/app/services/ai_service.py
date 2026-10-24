import base64, json, math
from pathlib import Path
from app.core.config import settings

SYSTEM_PROMPT = """You are the Vision Agent for MarineGuard AI. Analyze only visible evidence in a marine/coastal image. Never diagnose ocean health or confirm pollution from one image. Return ONLY JSON with keys: visual_indicators (array of objects with type,status,confidence,explanation), confidence (0-1), summary, limitations, needs_review. Allowed indicator types include marine_debris, water_appearance, coral_condition_visible, physical_damage_visible, unusual_object, marine_scene. For marine_debris, distinguish simple presence from clearly extensive/high-concentration accumulation when visually supported; use present_high_concentration only when the image clearly supports substantial accumulation. Use needs_review when evidence is weak/ambiguous. Mention that visual assessment is not laboratory diagnosis."""



def validate_vision_result(result):
    """Validate the structure of a vision model response."""
    if not isinstance(result, dict):
        return unavailable("Vision response is not a JSON object.")

    indicators = result.get("visual_indicators")
    confidence = result.get("confidence")
    needs_review = result.get("needs_review")

    if not isinstance(indicators, list):
        return unavailable("Vision response has invalid visual_indicators.")

    if (
        isinstance(confidence, bool)
        or not isinstance(confidence, (int, float))
        or not math.isfinite(confidence)
        or not 0 <= confidence <= 1
    ):
        return unavailable("Vision response has invalid confidence.")

    if not isinstance(needs_review, bool):
        return unavailable("Vision response has invalid needs_review.")

    for indicator in indicators:
        if not isinstance(indicator, dict):
            return unavailable("Vision response contains an invalid indicator.")

        if not all(
            isinstance(indicator.get(key), str)
            for key in ("type", "status", "explanation")
        ):
            return unavailable("Vision response contains an incomplete indicator.")

        indicator_confidence = indicator.get("confidence")

        if (
            isinstance(indicator_confidence, bool)
            or not isinstance(indicator_confidence, (int, float))
            or not math.isfinite(indicator_confidence)
            or not 0 <= indicator_confidence <= 1
        ):
            return unavailable("Vision response contains invalid indicator confidence.")

    if not isinstance(result.get("summary"), str):
        return unavailable("Vision response has an invalid summary.")

    if not isinstance(result.get("limitations"), str):
        return unavailable("Vision response has invalid limitations.")

    return result

def unavailable(reason: str):
    return {"visual_indicators":[],"confidence":0.0,"summary":"Vision analysis unavailable; additional review is required.","limitations":reason,"needs_review":True}

def analyze_with_gemini(path: Path):
    if not settings.gemini_api_key:
        return unavailable("Gemini API key is not configured. No visual finding was fabricated.")
    mime = {".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp"}.get(path.suffix.lower(),"image/jpeg")
    data = base64.b64encode(path.read_bytes()).decode()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.ai_model}:generateContent?key={settings.gemini_api_key}"
    payload={"system_instruction":{"parts":[{"text":SYSTEM_PROMPT}]},"contents":[{"parts":[{"text":"Analyze this marine observation image."},{"inline_data":{"mime_type":mime,"data":data}}]}],"generationConfig":{"response_mime_type":"application/json","temperature":0.1}}
    try:
        r=httpx.post(url,json=payload,timeout=45); r.raise_for_status()
        text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
        result = json.loads(text)
        return validate_vision_result(result)
    except Exception as e:
        return unavailable(f"Vision provider error: {type(e).__name__}. No visual finding was fabricated.")

def analyze_with_ollama(path: Path):
    try:
        import base64
        img=base64.b64encode(path.read_bytes()).decode()
        r=httpx.post(f"{settings.ollama_base_url}/api/chat",json={"model":settings.ollama_model,"stream":False,"format":"json","messages":[{"role":"system","content":SYSTEM_PROMPT},{"role":"user","content":"Analyze this marine image and return the required JSON.","images":[img]}]},timeout=90)
        r.raise_for_status()
        result = json.loads(r.json()["message"]["content"])
        return validate_vision_result(result)
    except Exception as e:
        return unavailable(f"Local vision provider error: {type(e).__name__}. No visual finding was fabricated.")

def analyze_image(path: Path):
    if settings.ai_provider.lower()=="ollama": return analyze_with_ollama(path)
    return analyze_with_gemini(path)
