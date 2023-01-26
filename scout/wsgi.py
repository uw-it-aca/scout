# Copyright 2023 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

import os
from django.core.wsgi import get_wsgi_application
"""
WSGI config for scout project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scout.settings")

application = get_wsgi_application()
