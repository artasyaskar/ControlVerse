def get_ai_explanation(system_output: dict) -> str:
    """
    Generates an explanation for the system behavior.
    In a real implementation, this would call the OpenAI API.
    """
    # Mock implementation
    overshoot = system_output.get("overshoot", "N/A")
    settling_time = system_output.get("settling_time", "N/A")
    explanation = f"The system exhibits an overshoot of {overshoot} and a settling time of {settling_time}. "
    explanation += "This is a typical response for a second-order system. "
    explanation += "You can adjust the Kp, Ki, and Kd parameters to tune the response."
    return explanation
