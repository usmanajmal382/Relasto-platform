from django.urls import path
from .views import (
    RegisterView, UserProfileView, AgentListView, 
    AgentDetailView, UserListView, PasswordResetRequestView, 
    PasswordResetConfirmView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('agents/', AgentListView.as_view(), name='agent-list'),
    path('agents/<int:pk>/', AgentDetailView.as_view(), name='agent-detail'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
