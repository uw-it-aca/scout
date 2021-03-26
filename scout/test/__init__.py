# Copyright 2021 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.test import TestCase
from django.test.utils import override_settings

DAO = 'Mock'


@override_settings(SPOTSEEKER_DAO_CLASS=DAO)
class ScoutTestCase(TestCase):
    '''Class to provide standard settings override'''
    pass
