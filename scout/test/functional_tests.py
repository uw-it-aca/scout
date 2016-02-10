#User can browse all spaces on campus for a place to eat without knowing anything about the space - https://jira.cac.washington.edu/browse/SCOUT-1


#User can search for a place to eat on campus by entering the name of the place as a search filter - https://jira.cac.washington.edu/browse/SCOUT-2


#User can find a place to eat on campus by viewing pins on a map which represent spots that meet the criteria of "open now" and are either near the user's current location or are centered around a central point on campus. https://jira.cac.washington.edu/browse/SCOUT-4


#User can find a place to eat by searching for places that are 'open specific hours' https://jira.cac.washington.edu/browse/SCOUT-5


#User can bring up a list of the most popular places to eat by clicking on a link in the app https://jira.cac.washington.edu/browse/SCOUT-6



#User can bring up a list of the places that serve coffee based on their current location by clicking a link https://jira.cac.washington.edu/browse/SCOUT-7



#User can bring up a list of places that serve breakfast by clicking a link in the app


"""
A simple functional headless UI test with pyvirtualdisplay and selenium
"""

from django.test import LiveServerTestCase
from django.utils.unittest import skipIf
from django.conf import settings

from pyvirtualdisplay import Display
from selenium import webdriver

SKIP_TESTS = True
if hasattr(settings, 'SKIP_FUNCTIONAL_TESTS'):
	SKIP_TESTS = settings.SKIP_FUNCTIONAL_TESTS

SKIP_TEXT = 'Functional tests are disabled'

class ExampleTestCase(LiveServerTestCase):
	def setUp(self):
		# start display
		self.vdisplay = Display(visible=0, size=(1024, 768))
		self.vdisplay.start()

		# start browser
		self.selenium = webdriver.Firefox()
		self.selenium.maximize_window()
		super(ExampleTestCase, self).setUp()

	def tearDown(self):
		# stop browser
		self.selenium.quit()
		super(ExampleTestCase, self).tearDown()

		# stop display
		self.vdisplay.stop()

	# check if this test should be skipped
	@skipIf(SKIP_TESTS, SKIP_TEXT)
	def test_example(self):
		# run tests
		self.selenium.get(
			'%s%s' % (self.live_server_url, '/test/example/')
		)
		test = self.selenium.find_element_by_id('test')
		self.assertEqual(test.text,"Hello World!")
