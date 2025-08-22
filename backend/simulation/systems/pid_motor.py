from ..models import SystemParameters

def simulate(params: SystemParameters):
    """Simulate a DC motor (first-order) under PID control with:
    - actuator saturation
    - integral anti-windup (conditional integration)
    - derivative-on-measurement with simple low-pass filter
    Plant: y' = -(1/tau) * y + k * u
    Reference step r = 1.0
    Euler integration with small dt.
    """
    kp, ki, kd = float(params.kp), float(params.ki), float(params.kd)

    # Motor constants (nominal)
    tau = 0.8  # time constant [s]
    k = 1.0    # gain

    dt = 0.0025
    t_end = 4.0
    n = int(t_end / dt) + 1

    # Saturation limits for actuator and output guardrails
    U_MIN, U_MAX = -10.0, 10.0
    Y_MIN, Y_MAX = -5.0, 5.0

    y = 0.0  # output (speed)
    y_prev = y
    i_term = 0.0
    d_filt = 0.0
    alpha = 0.9  # derivative low-pass smoothing factor (0..1), larger = smoother

    time = []
    response = []
    control = []
    reference = []

    for i in range(n):
        t = i * dt
        r = 1.0  # unit step reference
        e = r - y

        # Derivative on measurement (to avoid kick): dy/dt
        d_meas = (y - y_prev) / dt if i > 0 else 0.0
        d_filt = alpha * d_filt + (1 - alpha) * d_meas

        # Proportional + Derivative on measurement
        u_unsat = kp * e + ki * i_term - kd * d_filt

        # Apply saturation
        u = max(U_MIN, min(U_MAX, u_unsat))

        # Anti-windup: integrate only if not saturating against the error sign
        will_saturate_high = u_unsat > U_MAX and e > 0
        will_saturate_low = u_unsat < U_MIN and e < 0
        if not (will_saturate_high or will_saturate_low):
            i_term += e * dt
            # Clamp integrator
            if i_term > 100:
                i_term = 100
            elif i_term < -100:
                i_term = -100

        # Plant integration (Euler)
        y_dot = -(1.0 / tau) * y + k * u
        y_prev = y
        y = y + y_dot * dt

        # Guardrails to prevent numeric blow-up in plots
        if y > Y_MAX:
            y = Y_MAX
        elif y < Y_MIN:
            y = Y_MIN

        time.append(round(t, 4))
        response.append(y)
        control.append(u)
        reference.append(r)

    return {"time": time, "response": response, "control": control, "reference": reference}
