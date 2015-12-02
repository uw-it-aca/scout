from django.conf.urls import patterns, include, url

#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    
    # include applications 
    # url(r'^blog/', include('blog.urls')),
    # url(r'^admin/', include(admin.site.urls)),
    
    # application urls
    url(r'^$', 'scout.views.list_view', name='list_view'),
    url(r'^discover/', 'scout.views.discover_view', name='discover_view'),  
    url(r'^map/', 'scout.views.map_view', name='map_view'),  
    url(r'^detail/(?P<spot_id>[0-9]{1,2})', 'scout.views.detail_view', name='detail_view'),
    url(r'^favorites/', 'scout.views.favorites_view', name='favorites_view'),
    url(r'^filter/', 'scout.views.filter_view', name='filter_view'),
	
	# example hybrid components
	url(r'^components/', 'scout.views.hybrid_comps_view', name='hybrid_comps_view'),

)


