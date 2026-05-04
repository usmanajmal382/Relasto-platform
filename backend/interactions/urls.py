from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VisitRequestViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'visits', VisitRequestViewSet, basename='visitrequest')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
