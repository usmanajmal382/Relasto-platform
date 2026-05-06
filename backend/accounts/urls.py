from django.urls import path
from .views import RegisterView, UserProfileView, AgentListView, AgentDetailView, UserListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('agents/', AgentListView.as_view(), name='agent-list'),
    path('agents/<int:pk>/', AgentDetailView.as_view(), name='agent-detail'),
    path('users/', UserListView.as_view(), name='user-list'),
]
