from fastapi import APIRouter
from ..simulation.models import SystemParameters
from ..simulation import simulator

router = APIRouter()

@router.post("/simulate/{system_type}")
def run_simulation(system_type: str, params: SystemParameters):
    if system_type == "dc_motor":
        return simulator.simulate_dc_motor(params)
    elif system_type == "inverted_pendulum":
        return simulator.simulate_inverted_pendulum(params)
    elif system_type == "rlc_circuit":
        return simulator.simulate_rlc_circuit(params)
    else:
        return {"error": "System type not supported"}

@router.post("/explain")
def get_explanation(data: dict):
    # Placeholder for AI explanation
    return {"explanation": "This is a mock explanation."}
