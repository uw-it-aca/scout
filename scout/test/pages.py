#!/usr/bin/python

from selenium import webdriver
import time
import unittest

class BasePage(object):
    def __init__(self, driver):
        self.driver = driver

    @property
    def homeLogo(self):
        return self.driver.find_element_by_id('link_home')

    @property
    def discoverTab(self):
        return self.driver.find_element_by_id('link_discover')

    @property
    def placesTab(self):
        return self.driver.find_element_by_id('link_food')

    @property
    def pageId(self):
        temp =  self.driver.find_element_by_class_name('scout-content')
        return temp.get_attribute('id')

    @property
    def footer(self):
        return self.driver.find_element_by_class_name('scout-footer')

    def click_privacy(self):
        self.footer.find_element_by_link_text('Privacy').click()

    def click_terms(self):
        self.footer.find_element_by_link_text('Terms').click()

    def click_home(self):
        """Clicks home logo"""
        self.homeLogo.click()
        self._become_home()

    def click_discovertab(self):
        """Clicks discover tab"""
        self.discoverTab.click()
        self._become_home()

    def click_placestab(self):
        """Clicks places tab"""
        self.placesTab.click()
        self._become_places()

    def _become_home(self):
        self.__class__ = HomePage

    def _become_places(self):
        self.__class__ = PlacesPage

    def _become_detail(self):
        self.__class__ = DetailsPage

    def _become_filter(self):
        self.__class__ = FilterPage

class HomePage(BasePage):

    @property
    def openNearbyList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='open']//li[@class='scout-spot-list-discover']")

    @property
    def coffeeList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='coffee']//li[@class='scout-spot-list-discover']")

    @property
    def breakfastList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='breakfast']//li[@class='scout-spot-list-discover']")

    @property
    def lateList(self):
        return self.driver.find_elements_by_xpath(
           "//div[@id='late']//li[@class='scout-spot-list-discover']")

    @property
    def couponList(self):
        return self.driver.find_elements_by_xpath(
           "//div[@id='coupon']//li[@class='scout-spot-list-discover']")

    @property
    def openNearbyView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='open']//a[@class='scout-spot-discover-action']")

    @property
    def coffeeView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='coffee']//a[@class='scout-spot-discover-action']")

    @property
    def breakfastView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='breakfast']//a[@class='scout-spot-discover-action']")

    @property
    def lateView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='late']//a[@class='scout-spot-discover-action']")

    @property
    def couponView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='coupon']//a[@class='scout-spot-discover-action']")

    @property
    def use_location(self):
        return self.driver.find_element_by_id('use_location')

    @property
    def forget_location(self):
        return self.driver.find_element_by_id('forget_location')

    def click_use_location(self):
        self.use_location.click()

    def click_forget_location(self):
        self.forget_location.click()

    def click_place(self, food_type='open', num=0):
        """Given a category and a number, clicks the respective ranked place
        within that category (the first result being 0)"""
        food_types = {
            'open': self.openNearbyList,
            'coffee': self.coffeeList,
            'breakfast': self.breakfastList,
            'late': self.lateList,
            'coupon': self.couponList
        }
        place_list = food_types[food_type]
        try:
            button = place_list[num]
        except IndexError:
            raise PlaceIndexError(num, place_list)

        button.click()
        self._become_detail()
        # return DetailPage(self.driver)

    def click_results(self, food='open'):
        """Given a category, clicks the view more results link
        of that category"""
        linkLists = {
            'open': self.openNearbyView,
            'coffee': self.coffeeView,
            'breakfast': self.breakfastView,
            'late': self.lateView,
            'coupon': self.couponView
        }
        temp = linkLists.get(food)
        temp.click()
        self._become_places()

class PlaceIndexError(IndexError):
    def __init__(self, index, places):
        length = len(places)
        out = 'Place index %s out of range: %s' %(index, length)
        super(PlaceIndexError, self).__init__(out)

class PlacesPage(BasePage):

    @property
    def filterReset(self):
        return self.driver.find_element_by_id('reset_filter')

    @property
    def filterResults(self):
        return self.driver.find_element_by_id('link_filter')

    @property
    def filterBy(self):
        return self.driver.find_element_by_class_name('scout-filter-results-text')

    @property
    def placesCount(self):
        return self.driver.find_element_by_class_name('scout-filter-results-count')

    @property
    def placesNum(self):
        return int(self.placesCount.text)

    @property
    def placesList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@class='scout-list-container']/ol[@id='scout_list']/li")

    def placesName(self, num=0):
        """Returns the name element of the given
        numbered place on the places list"""
        place = self.placesList[num]
        placeName = place.find_element_by_class_name('scout-spot-name')
        return placeName

    def reset_filters(self):
        """Clicks the reset filter link"""
        self.filterReset.click()

    def get_filters(self):
        """Clicks the Filter Results link"""
        self.filterResults.click()
        self._become_filter()

    def click_place(self, num=0):
        """Given the num, clicks the respective place on the places list"""
        try:
            self.placesList[num].click()
        except IndexError:
            raise PlaceIndexError(num, self.placesList)
        else:
            self._become_detail()

class FilterPage(BasePage):

    @property
    def resetButton(self):
        return self.driver.find_element_by_id('reset_button')

    @property
    def viewButton(self):
        return self.driver.find_element_by_id('run_search')

    def getFilterSections(self):
        """Returns a dictionary that maps the filter category names with the
        element that contains all the checkboxes"""
        sects = self.driver.find_elements_by_css_selector('div.scout-card fieldset')
        results = {}
        for sect in sects:
            name = sect.find_element_by_tag_name('legend').text
            results[name] = sect
        return results

    @staticmethod
    def getFilterOptions(section):
        """Given an element, returns a dictionary that maps the checkbox labels
        with the input elements"""
        checkboxes = section.find_elements_by_tag_name('label')
        results = {}
        for box in checkboxes:
            filt = FilterBox(box)
            name = filt.name
            results[name] = filt
        return results

    def setFilters(self, filters={}):
        """Given a dictionary containing which filters should be clicked, clicks
        those respective filters"""
        sections = self.getFilterSections()
        for label, boxes in filters.items():
            try:
                section = sections[label]
            except KeyError:
                raise FilterKeyError(label, sections)
            checkboxes = self.getFilterOptions(section)
            for name, check in boxes.items():
                if check:
                    try:
                        checkboxes[name].click()
                    except KeyError:
                        raise FilterKeyError(name, checkboxes)

    def search(self):
        """Clicks the View Results button"""
        self.viewButton.click()
        self._become_places()

    def reset(self):
        """Clicks the reset button"""
        self.resetButton.click()

class FilterBox(object):
    def __init__(self, element):
        self.element = element
        self.box = element.find_element_by_tag_name('input')
        self.name = self.box.get_attribute('value')
        self.label = element.text

    def click(self):
        self.box.click()

class FilterKeyError(KeyError):
    def __init__(self, key, filters):
        # out = 'Potential filters: ' + ' '.join(filters.keys()) + ' doesn\'t contain ' + key
        flist = ' '.join(filters.keys())
        out = 'Desired filter %s not found in available filters (%s)' %(key, flist)
        super(FilterKeyError, self).__init__(out)

class DetailsPage(BasePage):

    @property
    def foodName(self):
        return self.driver.find_element_by_class_name('scout-spot-name')

    @property
    def foodCuisines(self):
        return self.driver.find_element_by_class_name('scout-spot-cuisine')

    @property
    def foodType(self):
        return self.driver.find_element_by_class_name('scout-spot-type')

    @property
    def openStatus(self):
        return self.driver.find_element_by_class_name('scout-spot-status')

if __name__ == '__main__':
    from selenium.webdriver import Firefox, Chrome
    d = Chrome()
    d.get('http://localhost:8001/')
    page = HomePage(d)
