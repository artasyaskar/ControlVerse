from typing import Optional
from pydantic import BaseModel


class SystemParameters(BaseModel):
    kp: float
    ki: float
    kd: float


class SimulationInput(BaseModel):
    kp: float
    ki: float
    kd: float
    project_id: Optional[int] = None
