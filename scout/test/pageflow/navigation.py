#!/usr/bin/python
"""
Tests the general navigation of the application
Testing the flow between pages through links
"""

import bs4
from scout.test import ScoutTestCase

baseUrl = '/seattle/'
foodUrl = baseUrl + 'food/'
studyUrl = baseUrl + 'study/'
techUrl = baseUrl + 'tech/'

urls = {
    'home': baseUrl,
    'food': foodUrl,
    'study': studyUrl,
    'tech': techUrl,
    'food_filter': foodUrl + 'filter/',
    'study_filter': studyUrl + 'filter/',
    'tech_filter': techUrl + 'filter/',
    'food_detail': foodUrl + '1/',
    # TODO add study_detail, tech_detail
}

# the key for this dictionary represents a page and the corresponding tuple
# represents the pages that should be linked to on the page
tests = {
    'home': ('home', 'food', 'study', 'tech'),
    'food': ('home', 'study', 'tech', 'food_filter'),
    'study': ('home', 'food', 'tech', 'study_filter'),
    'tech': ('home', 'food', 'study', 'tech_filter'),
    'food_filter': ('home', 'food', 'study', 'tech'),
    'study_filter': ('home', 'food', 'study', 'tech'),
    'tech_filter': ('home', 'food', 'study', 'tech'),
    'food_detail': ('home', 'food', 'study', 'tech'),
    # TODO add study_detail, tech_detail
}


def _makeTestFunc(start, end):
    """Returns a function that tests the navigation between two pages"""

    def _testFunc(self):
        page = self.get_soup(urls[start])
        self.assertTrue(self.checkLinkExists(page, urls[end]))

    _testFunc.__name__ = 'test_%s_to_%s' % (start, end)
    _testFunc.__doc__ = 'Assert that %s has a link to %s' % (start, end)
    return _testFunc


def _makeTestFooterFunc(start):
    """Returns a function that tests the footer links on a page"""

    def _func(self):
        self.check_footer_links_at_path(urls[start])

    _func.__name__ = "test_%s_footer_links" % (start)
    _func.__doc__ = "Assert that %s page contains the footer links" % (start)
    return _func


class MainNavigationTest(ScoutTestCase):
    """Navigation test set for scout"""

    @classmethod
    def setUpClass(cls):
        super(MainNavigationTest, cls).setUpClass()
        cls.soups = {}

    for page, links in tests.items():
        # testing the footer links on 'page'
        testFooter = _makeTestFooterFunc(page)
        testFooterName = testFooter.__name__
        vars()[testFooterName] = testFooter
        # testing that each link in the tuple is present on 'page'
        for link in links:
            testLink = _makeTestFunc(page, link)
            testLinkName = testLink.__name__
            vars()[testLinkName] = testLink

    del page, link, links, testLink, testLinkName, testFooter, testFooterName

    def checkLinkExists(self, soup, link):
        """Returns true if a link with the given href is found in the page"""
        return bool(soup.find('a', href=link))

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
        privacyLink, termsLink, mailtoLink = footerLinks
        self.assertEqual(
            privacyLink.get('href'),
            'http://www.washington.edu/online/privacy/'
        )
        self.assertEqual(
            termsLink.get('href'),
            'http://www.washington.edu/online/terms/'
        )
        self.assertEqual(
            mailtoLink.get('href'),
            'mailto:help@uw.edu?subject=Scout:%20Help%20needed'
        )
