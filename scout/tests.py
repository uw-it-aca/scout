from django.conf import settings
from django.utils import unittest
from scout.test.spacedao.space_dao import SpaceDAOTest
from scout.test.pageflow.page_load_status import UrlStatusTest

USERNAME = getattr(settings, 'SAUCE_USERNAME', False)
ACCESS_KEY = getattr(settings, 'SAUCE_ACCESS_KEY', False)

if USERNAME and ACCESS_KEY:
    from scout.test.pageflow_navigation import PageFlowNavigationTest
    from scout.test.fidelity_ui import UITest
