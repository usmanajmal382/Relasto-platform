import os
import sys

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend_core.wsgi import app

# This is the entry point for Vercel
application = app
