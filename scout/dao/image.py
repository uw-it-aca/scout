from django.conf import settings
from spotseeker_restclient.spotseeker import Spotseeker
from spotseeker_restclient.exceptions import DataFailureException
import oauth2


def get_client():
    # Required settings for the client
    if not hasattr(settings, 'SPOTSEEKER_HOST'):
        raise(Exception("Required setting missing: SPOTSEEKER_HOST"))
    if not hasattr(settings, 'SPOTSEEKER_OAUTH_KEY'):
        raise(Exception("Required setting missing: SPOTSEEKER_OAUTH_KEY"))
    if not hasattr(settings, 'SPOTSEEKER_OAUTH_SECRET'):
        raise(Exception("Required setting missing: SPOTSEEKER_OAUTH_SECRET"))

    consumer = oauth2.Consumer(key=settings.SPOTSEEKER_OAUTH_KEY,
                               secret=settings.SPOTSEEKER_OAUTH_SECRET)
    client = oauth2.Client(consumer)

    return client


def get_image(spot_id, image_id, height=None, width=None):
    client = get_client()
    if height and width is not None:
        url = "%s/api/v1/spot/%s/image/%s/thumb/%sx%s" % (
            settings.SPOTSEEKER_HOST,
            spot_id,
            image_id,
            width,
            height)
    else:
        url = "%s/api/v1/spot/%s/image/%s" % (settings.SPOTSEEKER_HOST,
                                              spot_id,
                                              image_id)
    return client.request(url, 'GET')
