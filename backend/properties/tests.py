from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Property

User = get_user_model()

class PropertiesAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.agent = User.objects.create_user(username='agent1', email='agent1@example.com', password='password')
        self.user = User.objects.create_user(username='user1', email='user1@example.com', password='password')
        
        self.property = Property.objects.create(
            agent=self.agent,
            title='Beautiful Villa',
            description='A very beautiful villa.',
            price=500000.00,
            status='sale',
            property_type='residential',
            address='123 Villa St'
        )

    def test_property_creation_unauthenticated(self):
        response = self.client.post('/api/properties/', {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_property_creation_authenticated(self):
        self.client.force_authenticate(user=self.agent)
        data = {
            'title': 'New Condo',
            'description': 'A nice condo',
            'price': 300000.00,
            'status': 'rent',
            'property_type': 'residential',
            'address': '456 Condo Ave'
        }
        response = self.client.post('/api/properties/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Property.objects.count(), 2)

    def test_property_filtering(self):
        # Create a second property for rent
        Property.objects.create(
            agent=self.agent, title='Rent House', description='...', price=1500, 
            status='rent', property_type='residential', address='789 Rent St'
        )
        response = self.client.get('/api/properties/?status=rent')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Assuming pagination
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Rent House')

    def test_property_search(self):
        response = self.client.get('/api/properties/?search=Villa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Beautiful Villa')

