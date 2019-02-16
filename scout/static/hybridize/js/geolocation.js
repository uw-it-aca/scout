var x = document.getElementById("geodemo");

var Geolocation = {

    get_latlng_from_coords: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },

    get_client_latlng: function (hlat, hlng) {

        var lat, lng;

        // make sure user coords are passed
        if (hlat && hlng) {
          console.log("user coords passed to geolocation");
          lat = hlat;
          lng = hlng;

        } else {
          console.log("using default coords on geolocation");
          lat = $("body").data("campus-latitude");
          lng = $("body").data("campus-longitude");

        }

        return Geolocation.get_latlng_from_coords(lat, lng);

    },

    get_distance_from_position: function (item_latlng, hlat, hlng) {
        // Returns distance in miles, rounded to 2 decimals

        // make sure user coords are passed
        if (hlat && hlng) {
          console.log("user coords passed to get distance");
          //console.log(crd);
        } else {
          console.log("using default coords to get distance");
        }

        var current_latlng = Geolocation.get_client_latlng(hlat, hlng);

        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_latlng, item_latlng);
        var miles_per_meter = 0.000621371;
        distance = (distance * miles_per_meter).toFixed(2);
        return distance;

    },

    /*
    getLocation: function() {

      console.log("getting location via html5...")

      $("#geodemo").html("Getting location...");

      var options = {
        enableHighAccuracy: true,
        timeout: 10000, //how long to wait for user to allow location sharing
        maximumAge: 0
      };

      function success(pos) {

        var crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        // update location display
        $("#geodemo").html("Latitude: " + crd.latitude + "<br>Longitude: " + crd.longitude);

        // wait and render the webview
        setTimeout(WebView.render(crd), 1000);

      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        $("#geodemo").html("Geolocation error occured. Use default location.");

        // wait and render the webview
        setTimeout(WebView.render, 1000);

      }


      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        $("#geodemo").html("Geolocation is not supported. Use default location.");
        WebView.render;

      }

    },
    */

    getNativeLocation: function(hlat, hlng) {

      console.log("getting location via native bridge...");

      // update location display
      $("#geodemo").html("Latitude: " + hlat + "<br>Longitude: " + hlng);

      // wait and render the webview
      setTimeout(WebView.render(hlat, hlng), 1000);

    },

    updateLocationDisplay: function() {
      // update location display
      $("#geodemo").html("Pull to Refresh...");
    }

};
