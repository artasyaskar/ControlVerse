from pydantic import BaseModel

class SystemParameters(BaseModel):
    kp: float
    ki: float
    kd: float
