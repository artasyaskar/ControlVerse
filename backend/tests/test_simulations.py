import pytest
from ..simulation.models import SystemParameters
from ..simulation.simulator import get_simulation

def test_get_simulation():
    params = SystemParameters(kp=1, ki=0, kd=0)
    
    # Test DC motor
    result = get_simulation("dc_motor", params)
    assert "time" in result
    assert "response" in result
    
    # Test inverted pendulum
    result = get_simulation("inverted_pendulum", params)
    assert "time" in result
    assert "response" in result

    # Test RLC circuit
    result = get_simulation("rlc_circuit", params)
    assert "time" in result
    assert "response" in result

    # Test invalid system type
    with pytest.raises(ValueError):
        get_simulation("invalid_system", params)
