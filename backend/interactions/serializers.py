from rest_framework import serializers
from .models import VisitRequest, Review
from accounts.serializers import UserSerializer
from properties.serializers import PropertySerializer

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    agent = UserSerializer(read_only=True)
    
    agent_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'agent', 'agent_id', 'rating', 'comment', 'created_at')
        read_only_fields = ('user', 'agent')

    def create(self, validated_data):
        agent_id = validated_data.pop('agent_id')
        user = self.context['request'].user
        return Review.objects.create(user=user, agent_id=agent_id, **validated_data)

class VisitRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # Using basic info for property and agent to avoid deep nesting
    property_id = serializers.IntegerField(write_only=True)
    agent_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = VisitRequest
        fields = (
            'id', 'user', 'property', 'property_id', 'agent', 'agent_id', 
            'contact_name', 'contact_email', 'contact_phone', 
            'preferred_date', 'status', 'created_at'
        )
        read_only_fields = ('user', 'property', 'agent', 'status')
        depth = 1 # Automatically serializes one level deep for read fields

    def create(self, validated_data):
        property_id = validated_data.pop('property_id')
        agent_id = validated_data.pop('agent_id')
        request_user = self.context['request'].user
        user = request_user if request_user.is_authenticated else None
        return VisitRequest.objects.create(
            user=user, 
            property_id=property_id, 
            agent_id=agent_id, 
            **validated_data
        )
