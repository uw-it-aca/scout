# Copyright 2022 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

"""
Tests the contents of each page, making sure the
necessary selectors are present
"""

import bs4
from scout.test import ScoutTestCase
from scout.dao.space import get_spot_list
baseUrl = '/seattle/'
baseUrlTacoma = '/tacoma/'
baseUrlBothell = '/bothell'


class ContentTest(ScoutTestCase):
    """Content test set for scout, (page id's)"""

    @classmethod
    def setUpClass(cls):
        super(ContentTest, cls).setUpClass()
        cls.soups = {}

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

    def assertOneExists(self, soup, selector):
        elements = soup.select(selector)
        num = len(elements)
        self.assertEqual(num, 1, 'Expected 1 of %s, got %s' % (selector, num))

    def test_home_content(self):
        """SCOUT-52 Test that the content on the home page is correct"""
        bs = self.get_soup(baseUrl)
        self.assertOneExists(bs, "#page_discover")

    def test_food_content(self):
        """SCOUT-53 Test that the content on the food page is correct"""
        bs = self.get_soup(baseUrl + 'food/')
        self.assertOneExists(bs, "#page_food")

    def test_filter_content(self):
        """SCOUT-54 Test that the content on the filter page is correct"""
        bs = self.get_soup(baseUrl + 'food/filter/')
        self.assertOneExists(bs, "#page_filter")

    def test_404_static_navigation(self):
        """SCOUT-1037 Test that base html static content is complete on 404.html"""
        study = self.get_soup(baseUrl + 'study/')
        soup404 = self.get_soup(baseUrl + '404/')
        """Test Privacy Policy"""
        self.assertHTMLEqual(str(study.find(id='link_privacy')), str(soup404.find(id='link_privacy')))
        """Test Terms of Use"""
        self.assertHTMLEqual(str(study.find(id='link_terms')), str(soup404.find(id='link_terms')))
        """Test UW Help"""
        self.assertHTMLEqual(str(study.find(id='link_help')), str(soup404.find(id='link_help')))


    def test_404_context_navigation(self):
        """SCOUT-1037 Test that base html dynamic content is complete on 404.html"""
        study_seattle = self.get_soup(baseUrl + 'study/')
        soup404_seattle = self.get_soup(baseUrl + '404/')
        study_tacoma = self.get_soup(baseUrlTacoma + 'study/')
        soup404_tacoma = self.get_soup(baseUrlTacoma + '404/')
        study_bothell = self.get_soup(baseUrlBothell + 'study/')
        soup404_bothell = self.get_soup(baseUrlBothell + '404/')
        """Test home buttons"""
        self.assertHTMLEqual(str(study_seattle.find(id='link_home')['href']), str(soup404_seattle.find(id='link_home')['href']))
        self.assertHTMLEqual(str(study_tacoma.find(id='link_home')['href']), str(soup404_tacoma.find(id='link_home')['href']))
        self.assertHTMLEqual(str(study_bothell.find(id='link_home')['href']), str(soup404_bothell.find(id='link_home')['href']))
        """Test Food button"""
        self.assertHTMLEqual(str(study_seattle.find(id='link_food')['href']), str(soup404_seattle.find(id='link_food')['href']))
        self.assertHTMLEqual(str(study_tacoma.find(id='link_food')['href']), str(soup404_tacoma.find(id='link_food')['href']))
        self.assertHTMLEqual(str(study_bothell.find(id='link_food')['href']), str(soup404_bothell.find(id='link_food')['href']))
        """Test study button"""
        self.assertHTMLEqual(str(study_seattle.find(id='link_study')['href']), str(soup404_seattle.find(id='link_study')['href']))
        self.assertHTMLEqual(str(study_tacoma.find(id='link_study')['href']), str(soup404_tacoma.find(id='link_study')['href']))
        self.assertHTMLEqual(str(study_bothell.find(id='link_study')['href']), str(soup404_bothell.find(id='link_study')['href']))
        """Test tech button"""
        self.assertHTMLEqual(str(study_seattle.find(id='link_tech')['href']), str(soup404_seattle.find(id='link_tech')['href']))
        self.assertHTMLEqual(str(study_tacoma.find(id='link_tech')['href']), str(soup404_tacoma.find(id='link_tech')['href']))
        self.assertHTMLEqual(str(study_bothell.find(id='link_tech')['href']), str(soup404_bothell.find(id='link_tech')['href']))