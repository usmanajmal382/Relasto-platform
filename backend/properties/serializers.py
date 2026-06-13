from rest_framework import serializers
from django.conf import settings
from .models import Property, PropertyImage, PropertyFeature
from accounts.serializers import UserSerializer


def build_cloudinary_url(image_field):
    """
    Build a correct Cloudinary URL directly from the stored field name,
    completely bypassing cloudinary_storage's .url method which doubles URLs.
    
    The stored name in DB can be:
      - Clean relative path:  'properties/photo.jpg'
      - Full URL (corrupted):  'https://res.cloudinary.com/.../properties/photo.jpg'
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

    # Now build the Cloudinary URL using our cloud name from settings
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    if cloud_name:
        return f'https://res.cloudinary.com/{cloud_name}/image/upload/{name}'

    # Fallback: try .url but catch errors
    try:
        return image_field.url
    except Exception:
        return None


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'is_primary')

    def get_image(self, obj):
        return build_cloudinary_url(obj.image)


class PropertyFeatureSerializer(serializers.ModelSerializer):
    property_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = PropertyFeature
        fields = ('id', 'property_id', 'key', 'value')

    def create(self, validated_data):
        property_id = validated_data.pop('property_id')
        return PropertyFeature.objects.create(property_id=property_id, **validated_data)


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    features = PropertyFeatureSerializer(many=True, read_only=True)
    agent = UserSerializer(read_only=True)

    class Meta:
        model = Property
        fields = (
            'id', 'agent', 'slug', 'title', 'description', 'price',
            'status', 'property_type', 'address', 'bedrooms', 'bathrooms', 'sqft',
            'created_at', 'updated_at',
            'images', 'features'
        )
        read_only_fields = ('slug',)
