from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Property, PropertyImage, PropertyFeature
from .serializers import PropertySerializer, PropertyImageSerializer, PropertyFeatureSerializer

class IsAgentOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_staff:
            return True
        # For PropertyFeature, the agent is on the related property
        if hasattr(obj, 'property'):
            return obj.property.agent == request.user
        return obj.agent == request.user

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAgentOwnerOrReadOnly]
    
    # Filtering, Searching, Ordering
    filterset_fields = ['status', 'property_type']
    search_fields = ['title', 'address']
    ordering_fields = ['price', 'created_at']

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAgentOwnerOrReadOnly])
    def upload_image(self, request, pk=None):
        property_obj = self.get_object()
        
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
            
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'
        
        # Manually create the PropertyImage, matching the profile upload logic which works perfectly
        image_obj = PropertyImage(
            property=property_obj,
            image=request.FILES['image'],
            is_primary=is_primary
        )
        image_obj.save()
        
        serializer = PropertyImageSerializer(image_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='delete_image/(?P<image_id>[^/.]+)',
            permission_classes=[permissions.IsAuthenticated, IsAgentOwnerOrReadOnly])
    def delete_image(self, request, pk=None, image_id=None):
        property_obj = self.get_object()
        try:
            image = PropertyImage.objects.get(id=image_id, property=property_obj)
            image.delete()
            return Response({'status': 'image deleted'}, status=status.HTTP_204_NO_CONTENT)
        except PropertyImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)


class PropertyFeatureViewSet(viewsets.ModelViewSet):
    queryset = PropertyFeature.objects.all()
    serializer_class = PropertyFeatureSerializer
    permission_classes = [permissions.IsAuthenticated, IsAgentOwnerOrReadOnly]

    def perform_create(self, serializer):
        # We assume property is passed in the request data
        serializer.save()
