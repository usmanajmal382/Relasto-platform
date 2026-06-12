import requests

url = "http://localhost:8000/api/interactions/visits/"
data = {
    "property_id": 5,
    "agent_id": 7,
    "contact_name": "Test User",
    "contact_email": "test@example.com",
    "contact_phone": "1234567890",
    "preferred_date": "2026-05-06T21:30:00Z",
    "message": "Hello, I want to see this property."
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
