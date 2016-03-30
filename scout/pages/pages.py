#!/usr/bin/python

from selenium.webdriver.common.by import By

class BasePage(object):
    def __init__(self, driver):
        self.driver = driver
    self.driver.implicitly_wait(5)
    self.timeout = 30

class PlacesPage(BasePage):

    @property
    def filterReset(self):
        return self.driver.find_element_by_id('reset_filter')

    @property
    def filterResults(self):
        return self.driver.find_element_by_id('link_filter')

    @property
    def discoverTab(self):
        return self.driver.find_element_by_id('link_discover')

    @property
    def placesTab(self):
        return self.driver.find_element_by_id('link_food')

    @property
    def placesList(self):
        return self.driver.find_elements_by_id("//div[@class='scout-list-container']/ol[@id='scout_list']/li")

    def reset_filters(self):
        self.filterReset.click()

    def get_filters(self):
        self.filterResults.click()

    def click_discoverTab(self):
        self.discoverTab.click()

    def click_placesTab(self):
        self.placesTab.click()

    def click_place(self, num = 0):
        try:
            self.placesList[num].click()
        except IndexError:
            self.fail('Index ' + num + ' is out of range: ' + len(placesList))

