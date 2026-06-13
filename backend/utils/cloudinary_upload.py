import cloudinary
import cloudinary.uploader
from rest_framework.exceptions import APIException


def upload_image(file, folder='uploads'):
    """
    Upload a file directly to Cloudinary using the official SDK.
    Returns the secure_url string.
    Raises an APIException if upload fails — never silently fails.
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type='image'
        )
        return result['secure_url']
    except Exception as e:
        raise APIException(detail=f'Cloudinary upload failed: {str(e)}')
