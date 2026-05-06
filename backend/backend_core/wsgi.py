import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')

application = get_wsgi_application()

# This is the "Magic" part for Vercel
# It runs migrations automatically whenever the app is loaded
try:
    print("Running migrations...")
    call_command('migrate', no_input=True)
except Exception as e:
    print(f"Migration error: {e}")

app = application
