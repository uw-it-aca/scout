var WebView = {

  load_app_with_location: function(lat, lng) {

      $("#hybrid_location_bridge").html(lat + ", " + lng);
      $("#hybrid_location_bridge").attr("data-user-latitude", lat);
      $("#hybrid_location_bridge").attr("data-user-longitude", lng);

  },

}
