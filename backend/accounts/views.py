from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
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

    def post(self, request, *args, **kwargs):
        # We handle avatar upload separately or together
        if 'profile_picture' in request.FILES:
            profile = request.user.profile
            profile.profile_picture = request.FILES['profile_picture']
            profile.save()
            return Response(UserSerializer(request.user).data)
        return super().post(request, *args, **kwargs)

class AgentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        return User.objects.filter(profile__is_agent=True).order_by('id')

class AgentDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.filter(profile__is_agent=True)

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)
    queryset = User.objects.all().order_by('-id')
