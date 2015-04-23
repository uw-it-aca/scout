from django.conf.urls import patterns, include, url

#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    
   
    
    # url(r'^blog/', include('blog.urls')),
    #url(r'^admin/', include(admin.site.urls)),
    
    # include applications
    url(r'^food/', include('food.urls')),
    
    url(r'^map/', 'scout.views.map_display', name='map_display'),
    url(r'^$', 'scout.views.favorites_list', name='favorites_list'),
     
)
