import cloudinary
import cloudinary.uploader
from rest_framework.exceptions import APIException
from django.conf import settings


def upload_image(file, folder='uploads'):
    """
    Upload a file directly to Cloudinary using the official SDK.
    Returns the secure_url string.
    Raises an APIException if upload fails or Cloudinary is not configured.
    """
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    api_key = getattr(settings, 'CLOUDINARY_API_KEY', None)
    api_secret = getattr(settings, 'CLOUDINARY_API_SECRET', None)

    if not cloud_name or not api_key or not api_secret:
        raise APIException(
            detail='Cloudinary is not configured on this server. '
                   'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env vars.'
        )

    # Always configure before each upload to be safe
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )

    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type='image'
        )
        secure_url = result.get('secure_url')
        if not secure_url:
            raise APIException(detail='Cloudinary returned no URL. Upload may have failed.')
        return secure_url
    except APIException:
        raise
    except Exception as e:
        raise APIException(detail=f'Cloudinary upload failed: {str(e)}')
