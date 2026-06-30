import requests

API_URL = "https://factory-safety-backend.onrender.com/api/violations/"

def send_violation(confidence, violation_type="No Helmet"):
    data = {
        "confidence": confidence,
        "violation_type": violation_type
    }

    try:
        response = requests.post(API_URL, json=data)
        print("Status Code:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Error sending violation:", e)