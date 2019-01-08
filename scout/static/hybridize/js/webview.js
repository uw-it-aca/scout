var WebView = {

  load_app_with_location: function(lat, lng) {

      // print back the user location for debugging
      $("#hybrid_location_bridge").html(lat + ", " + lng);

      // store the user location in body element as a data attribute
      $("body").attr("data-user-latitude", lat);
      $("body").attr("data-user-longitude", lng);
      $("body").attr("data-user-location", "true");

      $("#user_location").show();
      $("#default_location").hide();
      
      // get the app_type
      var type = $("body").data("app-type")

      if (type.indexOf("food") !== -1) {
          // food
          List.init();
          Filter.init();

      } else if (type.indexOf("study") !== -1){
          // study
          List.init();
          Filter.init();

          // study detail image slider
          if ($( ".photo-gallery").length) {
              $('.photo-gallery').not('.slick-initialized').slick({
                  dots: true,
                  arrows: false,
              });
          }

      } else if (type.indexOf("tech") !== -1){
          // tech
          List.init();
          Filter.init();
      } else {
          // discover
          Discover.init_cards();
      }

      // filter
      Filter.init_events();

  },

}
