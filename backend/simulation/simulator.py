from .models import SystemParameters
from .systems import pid_motor, pendulum, rlc

def get_simulation(system_type: str, params: SystemParameters):
    if system_type == "dc_motor":
        return pid_motor.simulate(params)
    elif system_type == "inverted_pendulum":
        return pendulum.simulate(params)
    elif system_type == "rlc_circuit":
        return rlc.simulate(params)
    else:
        raise ValueError("Invalid system type")
