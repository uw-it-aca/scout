#!/usr/bin/python
"""
Tests pages and their respective URL status codes
"""

import sys
from django.test import TestCase

# Statuses
OK = 200
notfound = 404
redir = 301


class UrlStatusTest(TestCase):
    """
    Ensure each listed URL/path results in the expected status code
    (200, 301, or 404).
    """

    _testCases = (
        ('Home', '/', OK),  # SCOUT-52
        ('Food', '/food/', OK),  # SCOUT-53
        ('Filter', '/filter/', OK),  # SCOUT-54
        ('Good Details Page', '/detail/1/', OK),
        ('Nonexistant Details Page', '/detail/88888/', notfound),  # SCOUT-55
        ('Malformed Details ID', '/detail/abcdefg', notfound),  # SCOUT-55?
        ('Malformed Details ID 2', '/detail/123456/', notfound),
        ('Nonexistant page', '/nonexistant/', notfound),  # SCOUT-56
        ('Filter Open', '/food/?open_now=true', OK),  # SCOUT-76
        ('Filter Coffee', '/food/?food0=s_food_espresso', OK),  # SCOUT-77
        ('Filter Breakfast', '/food/?period0=breakfast', OK),  # SCOUT-79
        ('Filter Latenight', '/food/?period0=late_night', OK),  # SCOUT-78
        ('Bad Filter', '/filter/404', notfound),  # SCOUT-81
        ('Home Missing Slash', '', OK),  # SCOUT-57?
        ('Food Missing Slash', '/food', redir),  # SCOUT-57?
        ('Filter Missing Slash', '/filter', redir),  # SCOUT-57?
        ('Details Missing Slash', '/detail/1234', redir),  # SCOUT-57?
    )

    def _clientUrlStatus(self, urlsuffix=''):
        """Returns the status code of the given URL"""
        res = self.client.get(urlsuffix)
        return res.status_code

    def assertUrlStatus(self, urlsuffix='', code=200):
        """
        Checks to see if the status code of the given URL matches the
        given status code.
        """
        url_status = self._clientUrlStatus(urlsuffix)
        self.assertEqual(
            url_status, code,
            'URL "%s" returned %s, expected %s' % (urlsuffix, url_status, code)
        )

    def _makeTestFunc(name, url, status=OK):
        """
        Returns a function that asserts that the given url results in the
        given status code, after setting its name and docstring accordingly.
        """
        def _testFunc(self):
            self.assertUrlStatus(url, status)

        _testFunc.__name__ = 'test_page_' + name.replace(' ', '_').lower()
        _testFunc.__doc__ = (
            'Assert "%s" results in a %s' % (url, status))

        return _testFunc

    for case in _testCases:
        _testFunc = _makeTestFunc(*case)
        name = _testFunc.__name__
        vars()[name] = _testFunc
    del case, name
