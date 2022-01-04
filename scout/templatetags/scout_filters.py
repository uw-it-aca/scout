# Copyright 2022 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django import template
import datetime
register = template.Library()


@register.filter
def remove_underscores(value):
    return value.replace('_', ' ')


@register.filter
def remove_periods(value):
    return value.replace('.', '')


@register.filter
def display_midnight(value):
    if value == '11:59 P.M.':
        return 'MIDNIGHT'

    return value


@register.filter
def format_phone(value):
    phone = '(%s) %s-%s' % (value[0:3], value[3:6], value[6:10])
    return phone
