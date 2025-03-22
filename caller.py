import os
import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")  # Replace with your project name
django.setup()

