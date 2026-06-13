from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def debug_cloudinary(request):
    """Temporary debug endpoint — checks if Cloudinary env vars are loaded on Railway."""
    return Response({
        'CLOUDINARY_CLOUD_NAME_set': bool(settings.CLOUDINARY_CLOUD_NAME),
        'CLOUDINARY_API_KEY_set': bool(settings.CLOUDINARY_API_KEY),
        'CLOUDINARY_API_SECRET_set': bool(settings.CLOUDINARY_API_SECRET),
        'cloud_name_value': settings.CLOUDINARY_CLOUD_NAME or 'NOT SET',
    })


urlpatterns = [
    path('admin/', admin.site.urls),

    # Temporary debug
    path('api/debug-cloudinary/', debug_cloudinary),

    # Auth / JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App APIs
    path('api/accounts/', include('accounts.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/interactions/', include('interactions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
