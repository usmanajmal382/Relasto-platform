from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from properties.models import Property
from .models import VisitRequest, Review

User = get_user_model()

class InteractionsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='user1', email='user1@example.com', password='password')
        self.agent = User.objects.create_user(username='agent1', email='agent1@example.com', password='password')
        self.property = Property.objects.create(
            agent=self.agent, title='Villa', description='Desc', price=100, status='sale', property_type='residential', address='123 St'
        )
        self.visit = VisitRequest.objects.create(
            user=self.user,
            property=self.property,
            agent=self.agent,
            contact_name='User One',
            contact_email='user1@example.com',
            contact_phone='1234567890',
            preferred_date=timezone.now()
        )
        self.review = Review.objects.create(
            user=self.user,
            agent=self.agent,
            rating=5,
            comment='Great agent!'
        )

    def test_visit_creation_api(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'property_id': self.property.id,
            'agent_id': self.agent.id,
            'contact_name': 'New User',
            'contact_email': 'newuser@example.com',
            'contact_phone': '0987654321',
            'preferred_date': timezone.now().isoformat()
        }
        response = self.client.post('/api/interactions/visits/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VisitRequest.objects.count(), 2)

    def test_review_creation_api(self):
        self.client.force_authenticate(user=User.objects.create_user(username='user2', password='password'))
        data = {
            'agent_id': self.agent.id,
            'rating': 4,
            'comment': 'Good.'
        }
        response = self.client.post('/api/interactions/reviews/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 2)

