var WebView = {

  store_location: function(lat, lng) {
    Cookies.set('user_lat', lat, { expires: 365 });
    Cookies.set('user_lng', lng, { expires: 365 });
    Cookies.set('user_location', 'true', { expires: 365 });
  },

}
