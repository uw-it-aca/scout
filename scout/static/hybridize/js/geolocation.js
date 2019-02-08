var x = document.getElementById("geodemo");

var Geolocation = {

    // drumheller fountain
    // default_location: { latitude: 47.653811, longitude: -122.307815 },

    /**
    campus_locations: function(campus){

        var locations = window.campus_locations;
        $.event.trigger(Geolocation.location_updating);
        if(locations !== undefined && locations[campus] !== undefined){
            Geolocation.default_location.latitude = locations[campus]["latitude"];
            Geolocation.default_location.longitude = locations[campus]["longitude"];
        }
    },
    **/

    // location_changed:  {"type": "location_changed"},

    // location_updating:  {"type": "location_updating"},

    // geolocation_status: { watchid: undefined },

    /**
    update_location: function () {

        // current user location is given more precedence over campus location.
        if (!Geolocation.get_is_using_location()) {
            Geolocation.set_campus_location();
        } else {

            // this will be called directly from native
            //Geolocation.query_client_location();
        }

        if(!window.has_set_loc){
            // Fire this event so pages can handle location on page load
            $.event.trigger(Geolocation.location_changed);
        }
        window.has_set_loc = true;

    },

    get_is_using_location: function () {
        return (localStorage.getItem("is_using_location") === 'true');
    },

    set_is_using_location: function (is_using_location) {
        // Setting should be bool
        // Persists between sessions
        localStorage.setItem("is_using_location", is_using_location);
        Geolocation.update_location();
    },

    set_location_type: function (type) {
        // Values: 'default', 'supplied', 'user'
        // Session only
        sessionStorage.setItem("location_type", type);
    },

    get_location_type: function () {
         return sessionStorage.getItem("location_type") || 'default';
     },

    set_client_location: function(position) {
        sessionStorage.setItem("lat", position.coords.latitude);
        sessionStorage.setItem("lng", position.coords.longitude);
        Geolocation.set_location_type("user");
        $.event.trigger(Geolocation.location_changed);
    },
    **/

    get_latlng_from_coords: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },

    get_client_latlng: function () {

        // if the lat/lng is passed in query params... it's user location_changed
        // else.. just use the lat/lng in the data-attribute (dafault campus location)

        var lat, lng;

        if ( $("body").data("user-latitude") && $("body").data("user-longitude") ) {
            lat = $("body").data("user-latitude");
            lng = $("body").data("user-longitude");
        } else {
            lat = $("body").data("campus-latitude");
            lng = $("body").data("campus-longitude");
        }

        return Geolocation.get_latlng_from_coords(lat, lng);
    },

    /*
    handle_watch_position: function (position) {
       if(Geolocation.get_is_using_location()){
           var new_position = Geolocation.get_latlng_from_coords(position.coords.latitude, position.coords.longitude);
           var distance = Geolocation.get_distance_from_position(new_position);
           Geolocation.set_client_location(position);
       }
    },
    */

    // function called from native...
    /**
    send_client_location: function(user_lat, user_lng) {

        var position =  { coords:
            {
                latitude: user_lat,
                longitude: user_lng
            }
        };

        //Filter.call_js_bridge("send_client_location called: " + position);
        Geolocation.set_client_location(position);
    },
    **/

    /**
    stop_watching_location: function(){
        var watchid = Geolocation.geolocation_status.watchid;
        if(watchid !== undefined){
            navigator.geolocation.clearWatch(watchid);
            Geolocation.geolocation_status.watchid = undefined;
        }
    },
    **/

    /**
    set_campus_location: function() {

        // get the campus from the url
        //var campus = window.location.pathname.split('/')[1]
        var campus = $("body").data("campus");

        Geolocation.campus_locations(campus);
        sessionStorage.setItem('lat', Geolocation.default_location.latitude);
        sessionStorage.setItem('lng', Geolocation.default_location.longitude);
        Geolocation.set_location_type("default");
        $.event.trigger(Geolocation.location_changed);
    },
    **/

    get_distance_from_position: function (item_latlng) {
        // Returns distance in miles, rounded to 2 decimals
        var current_latlng = Geolocation.get_client_latlng();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_latlng, item_latlng);
        var miles_per_meter = 0.000621371;
        distance = (distance * miles_per_meter).toFixed(2);
        return distance;

    },

    /***
    display_location_status: function () {

        if (Geolocation.get_location_type() === "default") {
            $("#default_position").show();
            $("#default_position").attr("aria-hidden", "false");

            $("#shared_position").hide();
            $("#shared_position").attr("aria-hidden", "true");
        } else {
            $("#default_position").hide();
            $("#default_position").attr("aria-hidden", "true");

            $("#shared_position").show();
            $("#shared_position").attr("aria-hidden", "false");
        }
    },

    init_location_toggles: function() {
        $("#use_location").click(function(e) {
            e.preventDefault();
            $.event.trigger(Geolocation.location_updating);
            Geolocation.set_is_using_location(true);
            $("#default_position").hide();
            $("#default_position").attr("aria-hidden", "true");

            $("#shared_position").show();
            $("#shared_position").attr("aria-hidden", "false");
        });

        $("#forget_location").click(function(e) {
            e.preventDefault();
            $.event.trigger(Geolocation.location_updating);
            Geolocation.set_is_using_location(false);
            Geolocation.stop_watching_location();
            $("#default_position").show();
            $("#default_position").attr("aria-hidden", "false");

            $("#shared_position").hide();
            $("#shared_position").attr("aria-hidden", "true");
        });

        $("#geolocation_error").click(function(e) {
            e.preventDefault();
            $(this).removeClass("open");
            $(this).addClass("closed");
        });

    }
    **/

    getLocation: function() {

      console.log("gettng location via html5...")

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

        var geocoder = new google.maps.Geocoder;
        var point = new google.maps.LatLng(
        pos.coords.latitude, pos.coords.longitude);
        geocoder.geocode({'latLng': point}, function (locations, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            for (var location of locations) {
              if ($.inArray('locality', location.types) != -1) {
                console.log('Your location is: ' + location.formatted_address);
                break;
              }
            };
          }
        });

        // update location display
        $("#geodemo").html("Latitude: " + pos.coords.latitude + "<br>Longitude: " + pos.coords.longitude);

        // wait and render the webview
        setTimeout(WebView.render, 1000);

      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        $("#geodemo").html(`ERROR(${err.code}): ${err.message}`);

        // wait and render the webview
        setTimeout(WebView.render, 1000);

      }


      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        $("#geodemo").html("Geolocation is not supported by this browser.");

        WebView.render;

      }

    },

};
