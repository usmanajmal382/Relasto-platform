from rest_framework import viewsets, permissions
from .models import VisitRequest, Review
from .serializers import VisitRequestSerializer, ReviewSerializer

class VisitRequestViewSet(viewsets.ModelViewSet):
    serializer_class = VisitRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Users see their requests, agents see requests assigned to them
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.is_agent:
            return VisitRequest.objects.filter(agent=user).order_by('-created_at')
        return VisitRequest.objects.filter(user=user).order_by('-created_at')

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['agent']

    def get_queryset(self):
        return Review.objects.all().order_by('-created_at')
