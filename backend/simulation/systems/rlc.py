from ..models import SystemParameters

def simulate(params: SystemParameters):
    """Simulate an RLC (2nd-order) plant under PID with saturation/anti-windup.

    y'' + 2*zeta*wn*y' + wn^2*y = k*u, step reference r=1
    """
    kp, ki, kd = float(params.kp), float(params.ki), float(params.kd)

    # Plant constants (representative)
    wn = 3.0
    zeta = 0.25
    k = 1.0

    dt = 0.0025
    t_end = 4.0
    n = int(t_end / dt) + 1

    U_MIN, U_MAX = -10.0, 10.0
    Y_MIN, Y_MAX = -5.0, 5.0

    y = 0.0
    ydot = 0.0
    y_prev = y
    i_term = 0.0
    d_filt = 0.0
    alpha = 0.9

    time = []
    response = []

    for i in range(n):
        t = i * dt
        r = 1.0
        e = r - y

        # Derivative on measurement (angle/voltage derivative estimate)
        d_meas = (y - y_prev) / dt if i > 0 else 0.0
        d_filt = alpha * d_filt + (1 - alpha) * d_meas

        u_unsat = kp * e + ki * i_term - kd * d_filt
        u = max(U_MIN, min(U_MAX, u_unsat))

        # Anti-windup
        will_saturate_high = u_unsat > U_MAX and e > 0
        will_saturate_low = u_unsat < U_MIN and e < 0
        if not (will_saturate_high or will_saturate_low):
            i_term += e * dt

        # Plant dynamics
        yddot = -2.0 * zeta * wn * ydot - (wn ** 2) * y + k * u
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
