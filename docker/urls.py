import os
from django.conf.urls import include, url

urlpatterns = [
    url(r'^', include('django_prometheus.urls'))
]

if os.getenv('AUTH', '') in ['SAML', 'SAML_MOCK', 'SAML_DJANGO_LOGIN']:
    urlpatterns += [url(r'^saml/', include('uw_saml.urls'))]

urlpatterns += [
    url(r'^', include('scout.urls')),
]
