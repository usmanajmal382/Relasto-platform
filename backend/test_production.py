import requests
import os
import random
from io import BytesIO

BASE_URL = "https://relasto-platform-production.up.railway.app/api"
USERNAME = "test_agent_2026"
PASSWORD = "TestPassword123!"

# Login to get token
login_res = requests.post(f"{BASE_URL}/token/", json={
    "username": USERNAME,
    "password": PASSWORD
})
if login_res.status_code != 200:
    print("Login failed:", login_res.text)
    exit(1)

token = login_res.json()['access']
headers = {"Authorization": f"Bearer {token}"}
print("Login successful.")

print("Creating a test property...")
rand_id = random.randint(1000, 9999)
prop_res = requests.post(f"{BASE_URL}/properties/", headers=headers, json={
    "title": f"Test Property {rand_id}",
    "description": "This is a test to verify Cloudinary uploads are working properly.",
    "price": "100000",
    "status": "sale",
    "property_type": "residential",
    "address": "123 Cloudinary Test Ave",
    "bedrooms": 2,
    "bathrooms": 2,
    "sqft": 1500
})

if prop_res.status_code != 201:
    print("Failed to create property:", prop_res.text)
    exit(1)

property_id = prop_res.json()['id']
print(f"Property created with ID: {property_id}")

print("Uploading a test image...")
image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
files = {
    'image': ('test_image.png', image_content, 'image/png')
}
data = {
    'is_primary': 'true'
}

upload_res = requests.post(f"{BASE_URL}/properties/{property_id}/upload_image/", headers=headers, files=files, data=data)

if upload_res.status_code != 201:
    print("Failed to upload image:", upload_res.status_code, upload_res.text)
    exit(1)

print("Image uploaded successfully!")
print("Response:", upload_res.json())

print("Verifying URL from properties list...")
check_res = requests.get(f"{BASE_URL}/properties/{property_id}/")
if check_res.status_code == 200:
    prop_data = check_res.json()
    images = prop_data.get('images', [])
    if images:
        print("Final Image URL:", images[0]['image'])
        img_check = requests.head(images[0]['image'])
        print(f"Cloudinary URL HTTP Status: {img_check.status_code} (200 means success!)")
    else:
        print("No images found in property data!")
else:
    print("Failed to fetch property data.")
