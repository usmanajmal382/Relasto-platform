from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()


def build_cloudinary_url(image_field):
    """
    Build a correct Cloudinary URL directly from the stored field name,
    completely bypassing cloudinary_storage's .url method which doubles URLs.

    The stored name in DB can be:
      - Clean relative path:  'profiles/photo.jpg'
      - Full URL (corrupted):  'https://res.cloudinary.com/.../profiles/photo.jpg'
      - Mangled full URL:      'https:/res.cloudinary.com/.../...'

    We always extract the clean relative path, then build the URL ourselves.
    """
    if not image_field:
        return None

    name = str(image_field.name if hasattr(image_field, 'name') else image_field)

    if not name:
        return None

    # If it contains a Cloudinary domain, extract the relative path after '/image/upload/'
    if 'res.cloudinary.com' in name:
        marker = '/image/upload/'
        idx = name.rfind(marker)
        if idx != -1:
            import re
            relative = name[idx + len(marker):]
            # Strip version prefix like 'v1234567890/'
            relative = re.sub(r'^v\d+/', '', relative)
            # Strip 'media/' prefix
            if relative.startswith('media/'):
                relative = relative[len('media/'):]
            name = relative

    # Strip 'media/' prefix from plain relative paths
    if name.startswith('media/'):
        name = name[len('media/'):]

    # Build the Cloudinary URL using our cloud name from settings
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    if cloud_name:
        return f'https://res.cloudinary.com/{cloud_name}/image/upload/{name}'

    # Fallback
    try:
        return image_field.url
    except Exception:
        return None


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('is_agent', 'phone_number', 'address', 'bio', 'profile_picture')

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['profile_picture'] = build_cloudinary_url(instance.profile_picture)
        return ret


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'profile', 'password')
        extra_kwargs = {'password': {'write_only': True}}

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
        profile, created = Profile.objects.get_or_create(user=user)
        profile.is_agent = is_agent
        profile.save()

        return user
