# Copyright 2024 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from uw_spotseeker import Spotseeker


def get_spot_image(spot_id, image_id, width=None):
    ss = Spotseeker()
    return ss.get_spot_image(spot_id, image_id, width)


def get_item_image(item_id, image_id, width=None):
    ss = Spotseeker()
    return ss.get_item_image(item_id, image_id, width)
