#!/usr/bin/python
"""
Tests the general navigation of the application
Testing the flow between pages through links
"""

import bs4
from django.test import LiveServerTestCase

class MainNavigationTest(LiveServerTestCase):
    """Navigation test set for scout"""

    def setUp(self):
        self.soups = {}

    def checkHrefBySelector(self, exp, selector, soup):
        """Given a selector, ensure that the first link found with that
        selector has an href matching 'exp'., returns the response
        of the href."""
        link = soup.select(selector)[0]
        self.checkHref(link, exp)
        return self.get_soup(exp)

    def checkHref(self, link, expectedLoc):
        """Given a link, ensure that its href is the same as expectedLoc"""
        linkHref = link.get('href')
        self.assertEqual(linkHref, expectedLoc)

    """
    def _test_foo_bar(self):
        import pdb; pdb.set_trace()
        response = self.client.get('/')
        for i in xrange(0, 50):
            #self.client.get('/')
            bs = bs4.BeautifulSoup(response.content, "html5lib")
    """

    def test_main_nav(self):
        """Goes from page to page and verifies that URLs are correct on
        each page """
        response = self.get_soup('/')
        # SCOUT-67
        dest = self.checkHrefBySelector('/food/', '#link_food', response)
        # SCOUT-68
        dest = self.checkHrefBySelector('/filter/','#link_filter', dest)
        # SCOUT-69
        dest = self.checkHrefBySelector('/', '#link_discover', dest)

    def test_home_to_home(self):
        """SCOUT-61 Tests the home logo link on the home page"""
        response = self.get_soup('/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_filter_to_home(self):
        """SCOUT-60 Tests the home logo link on the filter page"""
        response = self.get_soup('/filter/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_places_to_home(self):
        """SCOUT-59 Tests the home logo link on the places page"""
        response = self.get_soup('/food/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_filter_to_food(self):
        """SCOUT-62 Tests the food tab link on the filter page"""
        response = self.get_soup('/filter/')
        self.checkHrefBySelector('/food/', '#link_food', response)

    def get_soup(self, page):
        """Returns a soup object given a path, if there is no soup for the
        particular suffix, then it will create it and remember it"""
        if page in self.soups:
            return self.soups[page]
        else:
            response = self.client.get(page)
            soup = bs4.BeautifulSoup(response.content, "html5lib")
            self.soups[page] = soup
            return soup

    def check_footer_links_at_path(self, path):
        """Checks the footer links at the given path"""
        soup = self.get_soup(path)
        self.check_footer_links(soup)

    def check_footer_links(self, soup):
        """Checks the footer links at the given soup"""
        footerLinks = soup.select('div#footer a')
        privacyLink, termsLink = footerLinks
        self.assertEqual(privacyLink.get('href'), 'http://www.washington.edu/online/privacy/')
        self.assertEqual(termsLink.get('href'), 'http://www.washington.edu/online/terms/')

    def test_footer_links_home(self):
        """SCOUT-63 Checks the privacy/terms on the home page"""
        self.check_footer_links_at_path('/')

    def test_footer_links_food(self):
        """SCOUT-64 Checks the privacy/terms on the places page"""
        self.check_footer_links_at_path('/food/')

    def test_footer_links_filter(self):
        """SCOUT-65 Checks the privacy/terms on the filter page"""
        self.check_footer_links_at_path('/filter/')

    def test_footer_links_detail(self):
        """SCOUT-66 Checks the privacy/terms on the detail page"""
        self.check_footer_links_at_path('/detail/2/')
