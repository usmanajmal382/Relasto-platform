import requests
import random

BASE_URL = "https://relasto-platform-production.up.railway.app/api"

login_res = requests.post(f"{BASE_URL}/token/", json={
    "username": "test_agent_2026",
    "password": "TestPassword123!"
})
token = login_res.json()['access']
headers = {"Authorization": f"Bearer {token}"}
print("Logged in.")

# Create property
rand_id = random.randint(1000, 9999)
prop_res = requests.post(f"{BASE_URL}/properties/", headers=headers, json={
    "title": f"Debug Property {rand_id}",
    "description": "debug test",
    "price": "100000",
    "status": "sale",
    "property_type": "residential",
    "address": "Debug Ave",
    "bedrooms": 2,
    "bathrooms": 2,
    "sqft": 1500
})
property_id = prop_res.json()['id']
print(f"Property ID: {property_id}")

# Upload image and print FULL response including error details
image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

upload_res = requests.post(
    f"{BASE_URL}/properties/{property_id}/upload_image/",
    headers=headers,
    files={'image': ('test.png', image_content, 'image/png')},
    data={'is_primary': 'true'}
)
print(f"Upload HTTP Status: {upload_res.status_code}")
print(f"Upload Response Body: {upload_res.text}")
