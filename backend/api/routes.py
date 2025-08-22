from fastapi import APIRouter, HTTPException
from ..simulation.models import SystemParameters, SimulationInput
from ..simulation import simulator
from ..utils.ai_helper import get_ai_explanation
from ..utils.logging import log_session
from ..utils.supabase_client import get_supabase
from typing import Optional

router = APIRouter()

@router.post("/simulate/{system_type}")
def run_simulation(system_type: str, params: SimulationInput):
    try:
        # Keep simulator contract using SystemParameters only
        sim_params = SystemParameters(kp=params.kp, ki=params.ki, kd=params.kd)
        result = simulator.get_simulation(system_type, sim_params)
        # Best-effort log to Supabase
        log_session(
            project_id=params.project_id,
            input_data={"system_type": system_type, "kp": params.kp, "ki": params.ki, "kd": params.kd},
            output_data=result,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/explain")
def get_explanation(data: dict):
    explanation = get_ai_explanation(data)
    return {"explanation": explanation}


@router.get("/history")
def get_history(limit: int = 20, project_id: Optional[int] = None):
    """Return recent simulation sessions from Supabase.
    Query params:
      - limit: number of rows (default 20)
      - project_id: optional filter
    """
    try:
        sb = get_supabase()
        q = sb.table("session_history").select("*").order("created_at", desc=True).limit(limit)
        if project_id is not None:
            q = q.eq("project_id", project_id)
        res = q.execute()
        return {"items": res.data}
    except Exception as e:
        # If the table doesn't exist yet in Supabase, return empty items with a warning
        msg = str(e)
        if "PGRST205" in msg or "session_history" in msg and "find the table" in msg:
            return {"items": [], "warning": "session_history table not found in Supabase. Apply supabase/schema.sql and reload schema."}
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {e}")
