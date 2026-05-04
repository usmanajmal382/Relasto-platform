from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, PropertyFeatureViewSet

router = DefaultRouter()
router.register(r'features', PropertyFeatureViewSet, basename='propertyfeature')
router.register(r'', PropertyViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
