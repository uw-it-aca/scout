from django.conf import settings
from django.utils import unittest

USERNAME = getattr(settings, 'SAUCE_USERNAME', False)
ACCESS_KEY = getattr(settings, 'SAUCE_ACCESS_KEY', False)

if USERNAME and ACCESS_KEY:
    from scout.test.fidelity_pageflow import PageFlowTest

from scout.test.space_dao import SpaceDAOTest
