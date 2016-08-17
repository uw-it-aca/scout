#!/usr/bin/python
"""
Tests the general navigation of the application
Testing the flow between pages through links
"""

import bs4
from scout.test import ScoutTestCase

baseUrl = '/'
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
}

tests = {
    'home': ('home', 'food', 'study', 'tech'),
    'food': ('home', 'study', 'tech', 'food_filter'),
    'study': ('home', 'food', 'tech', 'study_filter'),
    'tech': ('home', 'food', 'study', 'tech_filter'),
    'food_filter': ('home', 'food', 'study', 'tech'),
    'study_filter': ('home', 'food', 'study', 'tech'),
    'tech_filter': ('home', 'food', 'study', 'tech'),
    'food_detail': ('home', 'food', 'study', 'tech'),
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
        testFooter = _makeTestFooterFunc(page)
        testFooterName = testFooter.__name__
        vars()[testFooterName] = testFooter
        for link in links:
            testLink = _makeTestFunc(page, link)
            testLinkName = testLink.__name__
            vars()[testLinkName] = testLink

    del page, link, links, testLink, testLinkName, testFooter, testFooterName

    def checkLinkExists(self, soup, link):
        return bool(soup.find('a', href=link))

    def checkHrefBySelector(self, exp, selector, soup):
        """Given a selector, ensure that the first link found with that
        selector has an href matching 'exp'., returns the response
        of the href."""
        link = soup.select(selector)[0]
        self.checkHref(link, exp)

    def checkHref(self, link, expectedLoc):
        """Given a link, ensure that its href is the same as expectedLoc"""
        linkHref = link.get('href')
        self.assertEqual(linkHref, expectedLoc)

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
        self.assertEqual(
            privacyLink.get('href'),
            'http://www.washington.edu/online/privacy/'
        )
        self.assertEqual(
            termsLink.get('href'),
            'http://www.washington.edu/online/terms/'
        )
