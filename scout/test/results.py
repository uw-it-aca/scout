#!/usr/bin/python

from django.test import LiveServerTestCase

class ResultsTest(LiveServerTestCase):

    def test_default_results(self):

        content = self.client.get('/food/').content

        expected = [
            '''"spot_name": 'Banh &amp; Naan, Husky Den',''',
            '''"spot_name": 'Husky Grind at District Market',''',
        ]

        for exp in expected:
            self.assertIn(exp, content)
