from ..models import SystemParameters

def simulate(params: SystemParameters):
    """Simulate a simplified inverted pendulum under PID with robustness features.

    Linearized unstable second-order: y'' = a*y + b*u, a>0.
    PID regulates angle y to 0 from an initial disturbance of 1 rad.
    Includes actuator saturation, anti-windup, derivative filtering, and guardrails.
    """
    kp, ki, kd = float(params.kp), float(params.ki), float(params.kd)

    a = 2.0   # instability factor
    b = 1.0   # control effectiveness

    dt = 0.0025
    t_end = 4.0
    n = int(t_end / dt) + 1

    U_MIN, U_MAX = -20.0, 20.0
    Y_MIN, Y_MAX = -10.0, 10.0

    y = 1.0   # start displaced by 1 rad
    y_prev = y
    ydot = 0.0
    i_term = 0.0
    d_filt = 0.0
    alpha = 0.9

    time = []
    response = []

    for i in range(n):
        t = i * dt
        r = 0.0
        e = r - y

        # Derivative on measurement
        d_meas = (y - y_prev) / dt if i > 0 else 0.0
        d_filt = alpha * d_filt + (1 - alpha) * d_meas

        u_unsat = kp * e + ki * i_term - kd * d_filt
        u = max(U_MIN, min(U_MAX, u_unsat))

        # Anti-windup
        will_saturate_high = u_unsat > U_MAX and e > 0
        will_saturate_low = u_unsat < U_MIN and e < 0
        if not (will_saturate_high or will_saturate_low):
            i_term += e * dt

        # Dynamics
        yddot = a * y + b * u
        y_prev = y
        ydot += yddot * dt
        y += ydot * dt

        # Guardrails
        if y > Y_MAX:
            y = Y_MAX
        elif y < Y_MIN:
            y = Y_MIN

        time.append(round(t, 4))
        response.append(y)

    return {"time": time, "response": response}
