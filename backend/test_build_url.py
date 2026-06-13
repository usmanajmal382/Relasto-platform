import os
os.environ['CLOUDINARY_CLOUD_NAME'] = 'testcloud'

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from properties.serializers import build_cloudinary_url

class Dummy:
    pass

d = Dummy()
d.name = 'properties/test.png'
print("Result with Dummy.name:", build_cloudinary_url(d))

d2 = Dummy()
d2.name = 'https://res.cloudinary.com/testcloud/image/upload/v1/media/properties/test2.png'
print("Result with corrupted full url:", build_cloudinary_url(d2))
