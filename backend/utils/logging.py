from typing import Optional, Any, Dict
from .supabase_client import get_supabase


def log_session(
    project_id: Optional[int],
    input_data: Dict[str, Any],
    output_data: Dict[str, Any],
    explanation: Optional[str] = None,
) -> None:
    """Best-effort logging to Supabase. Never raises.
    Expects `session_history` table as defined in supabase/schema.sql
    """
    try:
        supabase = get_supabase()
        payload = {
            "project_id": project_id,
            "input_data": input_data,
            "output_data": output_data,
            "explanation": explanation,
        }
        supabase.table("session_history").insert(payload).execute()
    except Exception as e:
        # Swallow logging errors to avoid breaking the main request,
        # but emit a console hint so we can diagnose Supabase issues.
        try:
            print(f"[log_session] Failed to insert into session_history: {e}")
        except Exception:
            pass
