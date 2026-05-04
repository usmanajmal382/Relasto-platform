from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class AccountsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.agent_list_url = reverse('agent-list')
        
        self.user = User.objects.create_user(username='testuser', email='test@test.com', password='password123')
        self.agent = User.objects.create_user(username='testagent', email='agent@test.com', password='password123')
        # make testagent an actual agent
        profile = self.agent.profile
        profile.is_agent = True
        profile.save()

    def test_register_user(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_agent_list(self):
        response = self.client.get(self.agent_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only return testagent
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['username'], 'testagent')
