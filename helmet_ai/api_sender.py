import requests

API_URL = "https://factory-safety-backend.onrender.com/api/violation/"

def send_violation(confidence):
    data = {
        "worker": "Unknown",
        "violation_type": "No Helmet",
        "confidence": confidence
    }

    try:
        response = requests.post(API_URL, json=data)
        print("Status:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Error:", e)