from rest_framework import serializers
from .models import Property, PropertyImage, PropertyFeature
from accounts.serializers import UserSerializer


def _clean_cloudinary_url(raw_url):
    """
    Return a clean, working Cloudinary URL from a potentially malformed one.

    Known corruption patterns (caused by bad MEDIA_URL config in the past):
      1. Doubled full URL:
         https://res.cloudinary.com/X/image/upload/v1/media/https:/res.cloudinary.com/X/image/upload/...
         → Extract from the last 'https://res.cloudinary.com' occurrence.

      2. 'v1/media/' prefix injected by cloudinary_storage when MEDIA_URL was wrong:
         https://res.cloudinary.com/X/image/upload/v1/media/properties/file.jpg
         → Strip the 'v1/media/' segment after '/image/upload/'.

      3. Clean URL — already correct, return as-is.
    """
    if not raw_url:
        return None
    url = str(raw_url)

    # Case 1: doubled URL — there are two 'res.cloudinary.com' occurrences
    if url.count('res.cloudinary.com') > 1:
        # Find the LAST occurrence and return from there
        last_idx = url.rfind('https://res.cloudinary.com')
        if last_idx != -1:
            url = url[last_idx:]
        else:
            # single-slash variant e.g. http:/res.cloudinary.com
            last_idx2 = url.rfind('http:/res.cloudinary.com')
            if last_idx2 != -1:
                url = 'https://' + url[last_idx2 + len('http:/'):]

    # Case 2: 'v1/media/' injected — strip it
    # Pattern: .../image/upload/v1/media/real/path.jpg
    bad_segment = '/image/upload/v1/media/'
    if bad_segment in url:
        url = url.replace(bad_segment, '/image/upload/', 1)

    # Case 3: '/media/' injected without version
    bad_segment2 = '/image/upload/media/'
    if bad_segment2 in url:
        url = url.replace(bad_segment2, '/image/upload/', 1)

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
