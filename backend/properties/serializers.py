from rest_framework import serializers
from .models import Property, PropertyImage, PropertyFeature
from accounts.serializers import UserSerializer


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


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'is_primary')

    def get_image(self, obj):
        if obj.image:
            try:
                return _clean_cloudinary_url(obj.image.url)
            except Exception:
                return _clean_cloudinary_url(str(obj.image))
        return None


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
