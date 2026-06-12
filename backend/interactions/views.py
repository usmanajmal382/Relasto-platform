from rest_framework import viewsets, permissions
from .models import VisitRequest, Review, Notification
from .serializers import VisitRequestSerializer, ReviewSerializer, NotificationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class VisitRequestViewSet(viewsets.ModelViewSet):
    serializer_class = VisitRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return VisitRequest.objects.none()
        if hasattr(user, 'profile') and user.profile.is_agent:
            return VisitRequest.objects.filter(agent=user).order_by('-created_at')
        return VisitRequest.objects.filter(user=user).order_by('-created_at')

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['agent']

    def get_queryset(self):
        return Review.objects.all().order_by('-created_at')

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})
