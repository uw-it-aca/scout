#!/usr/bin/python
"""
Tests pages and their respective URL status codes
"""

from scout.test import ScoutTestCase

# Statuses
OK = 200
notfound = 404
redir = 301

# Each of these will be turned into a test function
_testCases = (
    # General
    ('Home', '/', OK, 'SCOUT-52'),
    ('Nonexistant page', '/nonexistant/', notfound, 'SCOUT-56'),
    ('Home Missing Slash', '', OK, 'SCOUT-57'),
    # Food
    ('Food', '/food/', OK, 'SCOUT-53'),
    ('Food Filter', '/food/filter/', OK, 'SCOUT-54'),
    ('Food Details Page', '/food/1/', OK, 'SCOUT-58'),
    ('Nonexistant Food Details Page', '/food/88888/', notfound, 'SCOUT-55'),
    ('Malformed Food Details ID', '/food/abcdefg', notfound, 'SCOUT-55'),
    ('Malformed Food Details ID 2', '/food/123456/', notfound, 'SCOUT-55'),
    ('Food Filter Open', '/food/?open_now=true', OK, 'SCOUT-76'),
    ('Food Filter Coffee', '/food/?food0=s_food_espresso', OK, 'SCOUT-77'),
    ('Food Filter Breakfast', '/food/?period0=morning', OK, 'SCOUT-79'),
    ('Food Filter Latenight', '/food/?period0=late_night', OK, 'SCOUT-78'),
    # Invalid params should not cause a 404 or other error
    ('Food Invalid Filter Params', '/food/?open_now=invalid', OK, 'SCOUT-156'),
    ('Food Invalid Filter Params 2', '/food/?blah', OK, 'SCOUT-156'),
    ('Food Invalid Filter Params 3', '/food/?blah=blah', OK, 'SCOUT-156'),
    ('Invalid Food URL', '/food/abc', notfound, 'SCOUT-157'),
    ('Food Bad Filter', '/food/filter/404', notfound, 'SCOUT-81'),
    ('Food Missing Slash', '/food', redir, 'SCOUT-57'),
    ('Food Filter Missing Slash', '/food/filter', redir, 'SCOUT-57'),
    ('Food Details Missing Slash', '/food/1234', redir, 'SCOUT-57'),
    # Study
    ('Study', '/study/', OK),
    # ('Study Filter', '/study/filter/', OK),
    ('Study Missing Slash', '/study', redir),
    # ('Study Filter Missing Slash', '/study/filter', redir),
    # TODO once wired up & mock data made: study/tech details and filters
    ('Malformed Study Details ID', '/study/abcdefg', notfound),
    ('Malformed Study Details ID 2', '/study/123456/', notfound),
    # Tech
    ('Tech', '/tech/', OK),
    # ('Tech Filter', '/tech/filter/', OK),
    ('Tech Missing Slash', '/tech', redir),
    # ('Tech Filter Missing Slash', '/tech/filter', redir),
    ('Malformed Tech Details ID', '/tech/abcdefg', notfound),
    ('Malformed Tech Details ID 2', '/tech/123456/', notfound),

)


def _makeTestFunc(name, url, status=OK, issue=None):
    """
    Returns a function that tests the given URL using
    assertUrlStatus.
    """
    def _testFunc(self):
        self.assertUrlStatus(url, status)

    _testFunc.__name__ = 'test_page_' + name.replace(' ', '_').lower()
    doc = 'Assert "%s" results in a %s' % (url, status)
    if issue is not None:
        doc += ' (%s)' % issue
    _testFunc.__doc__ = doc

    return _testFunc


class UrlStatusTest(ScoutTestCase):
    """
    Ensure each listed URL/path results in the expected status code
    (200, 301, or 404).
    """

    def _clientUrlStatus(self, urlsuffix=''):
        """Returns the status code of the given URL"""
        res = self.client.get(urlsuffix)
        return res.status_code

    def assertUrlStatus(self, urlsuffix='', code=200):
        """
        Asserts that the given url (path only) returns the given
        status code.
        """
        url_status = self._clientUrlStatus(urlsuffix)
        self.assertEqual(
            url_status, code,
            'URL "%s" returned %s, expected %s' % (urlsuffix, url_status, code)
        )

    # Generate a test function from each test case tuple
    for case in _testCases:
        _testFunc = _makeTestFunc(*case)
        name = _testFunc.__name__
        vars()[name] = _testFunc
    # Cleanup so temp vars don't clutter automatically-generated docs
    del case, name, _testFunc
