from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

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
            return Response(UserSerializer(request.user, context={'request': request}).data)
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

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # In a real app, you would send an email. For now, we'll print it to console.
            reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
            
            import sys
            print(f"\n--- PASSWORD RESET LINK FOR {email} ---")
            print(reset_link)
            print("----------------------------------------\n")
            sys.stdout.flush()
            
            # Optionally send actual email if backend is configured
            # send_mail(
            #     "Password Reset Request",
            #     f"Click here to reset your password: {reset_link}",
            #     settings.DEFAULT_FROM_EMAIL,
            #     [email],
            #     fail_silently=True,
            # )
            
            return Response({"message": "If this email exists, a reset link has been sent."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # We return 200 even if user doesn't exist for security (don't reveal email addresses)
            return Response({"message": "If this email exists, a reset link has been sent."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([uidb64, token, new_password]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
