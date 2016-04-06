#!/usr/bin/python

import bs4
from django.test import Client

class BasePage(object):
    def __init__(self, response):
        self.response = response
        self.soup = self.updateSoup()
        self.client = Client()

    def updateSoup(self):
        return bs4.BeautifulSoup(self.response.content, "html5lib")

    @property
    def homeLogo(self):
        return self.soup.select('#link_home')

    @property
    def discoverTab(self):
        return self.soup.select('#link_discover')

    @property
    def placesTab(self):
        return self.soup.select('#link_food')

    def click_home(self):
        link = self.homeLogo.get('href')
        self.response = self.client.get(link)
        self.soup = self.updateSoup()
        self._become_home()
    """
    def _become_home(self):
        self.__class__ = HomePage

    def _become_places(self):
        self.__class__ = PlacesPage

    def _become_detail(self):
        self.__class__ = DetailsPage

    def _become_filter(self):
        self.__class__ = FilterPage
    """


