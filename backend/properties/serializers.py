from rest_framework import serializers
from .models import Property, PropertyImage, PropertyFeature
from accounts.serializers import UserSerializer

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'is_primary')

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
            'status', 'property_type', 'address', 'created_at', 'updated_at',
            'images', 'features'
        )
        read_only_fields = ('slug',)
