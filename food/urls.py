from django.conf.urls import patterns, include, url

#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    
    
    url(r'^detail/', 'food.views.eatery_detail', name='eatery_detail'),
    url(r'^', 'food.views.eatery_list', name='eatery_list'),
    
    # url(r'^blog/', include('blog.urls')),
    #url(r'^admin/', include(admin.site.urls)),
    
    # include applications
    #url(r'^', include('app_name.urls')),
)
