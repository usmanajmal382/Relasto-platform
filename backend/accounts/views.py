from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class AgentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        return User.objects.filter(profile__is_agent=True).order_by('id')

class AgentDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.filter(profile__is_agent=True)
