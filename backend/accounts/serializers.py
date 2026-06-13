from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()


def _clean_cloudinary_url(raw_url):
    """
    Extract a clean Cloudinary URL from a potentially doubled/malformed URL.
    This handles cases where the stored DB value already contains a full
    Cloudinary URL that then gets MEDIA_URL prepended to it again.
    """
    if not raw_url:
        return None
    url = str(raw_url)
    # Already a clean, single Cloudinary URL — return as-is
    if url.startswith('https://res.cloudinary.com') and url.count('res.cloudinary.com') == 1:
        return url
    # Handle doubled URL: pick everything from the last occurrence of the base
    marker = 'https://res.cloudinary.com'
    last_idx = url.rfind(marker)
    if last_idx != -1:
        return url[last_idx:]
    # Handle single-slash mangled variant: http:/res.cloudinary.com
    marker2 = 'http:/res.cloudinary.com'
    last_idx2 = url.rfind(marker2)
    if last_idx2 != -1:
        return 'https://' + url[last_idx2 + len('http:/'):]
    return url


class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('is_agent', 'phone_number', 'address', 'bio', 'profile_picture')

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            try:
                return _clean_cloudinary_url(obj.profile_picture.url)
            except Exception:
                return _clean_cloudinary_url(str(obj.profile_picture))
        return None


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
        # Profile is typically created automatically via signals,
        # but if not, we create/update it here.
        profile, created = Profile.objects.get_or_create(user=user)
        profile.is_agent = is_agent
        profile.save()

        return user
