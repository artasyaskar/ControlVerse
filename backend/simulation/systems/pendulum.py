import numpy as np
from ..models import SystemParameters

def simulate(params: SystemParameters):
    """Simulate an inverted pendulum with accurate physics and PID control.
    
    Parameters:
    - kp: Proportional gain
    - ki: Integral gain
    - kd: Derivative gain
    
    Returns:
    - Dictionary with time and response arrays
    """
    # System parameters
    g = 9.81      # gravity (m/s^2)
    l = 0.5       # length of pendulum (m)
    m = 0.1       # mass of pendulum (kg)
    b = 0.1       # damping coefficient (N·m·s/rad)
    
    # Simulation parameters
    dt = 0.01     # time step (s)
    t_end = 10.0  # simulation time (s)
    n = int(t_end / dt) + 1  # number of time steps
    
    # Control parameters
    kp = float(params.kp)
    ki = float(params.ki)
    kd = float(params.kd)
    
    # Control limits
    u_max = 20.0  # Maximum control effort (N·m)
    u_min = -20.0  # Minimum control effort (N·m)
    
    # Initial conditions
    theta = 0.1    # initial angle (rad) - small initial disturbance
    theta_dot = 0.0  # initial angular velocity (rad/s)
    integral = 0.0  # integral term
    
    # Pre-allocate arrays
    time = np.linspace(0, t_end, n)
    response = np.zeros(n)
    control = np.zeros(n)
    
    # Main simulation loop
    for i in range(n):
        # Store current state
        response[i] = theta
        
        # Reference (upright position)
        ref = 0.0
        
        # Calculate error
        error = ref - theta
        
        # Update integral term with anti-windup
        if i > 0:
            integral += error * dt
            
            # Anti-windup: Only integrate if not saturating
            if (control[i-1] >= u_max and error > 0) or (control[i-1] <= u_min and error < 0):
                integral -= error * dt
        
        # Calculate derivative term (using backward difference)
        if i > 0:
            derivative = (theta - response[i-1]) / dt
        else:
            derivative = 0.0
        
        # Calculate control signal
        u = kp * error + ki * integral + kd * derivative
        
        # Apply control limits
        u = np.clip(u, u_min, u_max)
        control[i] = u
        
        # Pendulum dynamics (Euler integration)
        if i < n - 1:
            # Angular acceleration
            theta_dot_dot = (m * g * l * np.sin(theta) - b * theta_dot + u) / (m * l**2)
            
            # Update state
            theta_dot += theta_dot_dot * dt
            theta += theta_dot * dt
            
            # Keep theta in [-pi, pi] for numerical stability
            if theta > np.pi:
                theta -= 2 * np.pi
            elif theta < -np.pi:
                theta += 2 * np.pi
    
    return {
        "time": time.tolist(),
        "response": response.tolist(),
        "control": control.tolist()
    }
