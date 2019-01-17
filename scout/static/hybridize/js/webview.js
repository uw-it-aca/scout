var WebView = {

  store_location: function(lat, lng) {
    Cookies.set('user_lat', lat, { expires: 365 });
    Cookies.set('user_lng', lng, { expires: 365 });
    Cookies.set('user_location', 'true', { expires: 365 });
    WebView.update_location_display();
  },

  update_location_display: function() {

    if (Cookies.get("user_location")) {

      // temp display of lat lng values
      var blah1 = Cookies.get('user_lat');
      var blah2 = Cookies.get('user_lng');

      console.log(blah1 + ", " + blah2);

      $("#user_location").show();
      $("#hybrid_location_bridge").html(blah1 + ", " + blah2);
    } else {

      console.log("no cookies set.. default");

      $("#default_location").show();
    }

  },

  new_location_message: function() {
    $("#hybrid_location_bridge").html("Pull to refresh!");
  }

}
