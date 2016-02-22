var Geolocation = {
    default_location: { latitude: 47.653811, longitude: -122.307815 },
    location_changed:  new CustomEvent("location_changed"),

    // Must be called first, sets default or real client location
    init_location: function () {
        // Prevent duplicate calls to init from changing location
        if (sessionStorage.getItem("lat") === null){
            if (!Geolocation.get_is_using_location()) {
                Geolocation.set_default_location();
            } else  {
                Geolocation.query_client_location();
            }
        } else {
            // Fire this event so pages can handle location on page load
            window.dispatchEvent(Geolocation.location_changed);
        }
    },

    update_location: function () {
        if (!Geolocation.get_is_using_location()) {
            Geolocation.set_default_location();
        } else {
            Geolocation.query_client_location();
        }
    },

    get_is_using_location: function () {
        return (localStorage.getItem("using_location") === 'true');
    },

    set_is_using_location: function (is_using_location) {
        // Setting should be bool
        // Persists between sessions
        localStorage.setItem("using_location", is_using_location);
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
        window.dispatchEvent(Geolocation.location_changed);
    },

    get_latlng_from_coords: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },

    get_client_latlng: function () {
        var lat = sessionStorage.getItem("lat");
        var lng = sessionStorage.getItem("lng");
        return Geolocation.get_latlng_from_coords(lat, lng);
    },

    get_position_string: function () {
        var lat = sessionStorage.getItem("lat");
        var lng = sessionStorage.getItem("lng");
        return lat + ", " + lng;
    },

    query_client_location: function() {
        // deal w/ error state
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(Geolocation.set_client_location);
        }
    },

    set_default_location: function() {
        sessionStorage.setItem('lat', Geolocation.default_location.latitude);
        sessionStorage.setItem('lng', Geolocation.default_location.longitude);
        Geolocation.set_location_type("default");
        window.dispatchEvent(Geolocation.location_changed);
    },

    get_distance_from_position: function (item_latlng) {
        // Returns distance in rounded feet
        var current_latlng = Geolocation.get_client_latlng();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_latlng, item_latlng);
        distance = Math.round(distance * 3.280839895);
        return distance;

    },

    display_location_status: function () {
        if (Geolocation.get_location_type() === "default") {
            $("#default_position").show();
            $("#shared_position").hide();
        } else {
            $("#shared_position").show();
            $("#default_position").hide();
            $("#user_location").html(Geolocation.get_position_string());
        }
    },

    init_location_toggles: function ( ){
        $("#use_location").click(function() {
            Geolocation.set_is_using_location(true);
            $("#shared_position").show();
            $("#default_position").hide();
        });

        $("#forget_location").click(function() {
            Geolocation.set_is_using_location(false);
            $("#shared_position").hide();
            $("#default_position").show();
        });
    }


};