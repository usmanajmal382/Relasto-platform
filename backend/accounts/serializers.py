from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('is_agent', 'phone_number', 'address', 'bio')

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.save()

        if profile_data is not None:
            profile = instance.profile
            profile.phone_number = profile_data.get('phone_number', profile.phone_number)
            profile.address = profile_data.get('address', profile.address)
            profile.bio = profile_data.get('bio', profile.bio)
            profile.save()
            
        return instance

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    is_agent = serializers.BooleanField(write_only=True, required=False, default=False)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'is_agent')

    def create(self, validated_data):
        is_agent = validated_data.pop('is_agent', False)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Profile is typically created automatically via signals, 
        # but if not, we create/update it here.
        profile, created = Profile.objects.get_or_create(user=user)
        profile.is_agent = is_agent
        profile.save()
        
        return user
