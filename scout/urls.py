from django.conf.urls import patterns, include, url

#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    
    # include applications 
    # url(r'^blog/', include('blog.urls')),
    # url(r'^admin/', include(admin.site.urls)),
    
    # application urls
    
    url(r'^$', 'scout.views.home_view', name='home_view'),    
    url(r'^map/', 'scout.views.map_view', name='map_view'),  
    url(r'^list/', 'scout.views.list_view', name='list_view'),
    url(r'^detail/\d{1,2}', 'scout.views.detail_view', name='detail_view'),
    url(r'^favorites/', 'scout.views.favorites_view', name='favorites_view'),
    url(r'^filters/', 'scout.views.filters_view', name='filters_view'),


)


