var Geolocation = {
    // drumheller fountain
    default_location: { latitude: 47.653811, longitude: -122.307815 },

    campus_locations: function(campus){
        var locations = window.campus_locations;
        $.event.trigger(Geolocation.location_updating);
        if(locations !== undefined && locations[campus] !== undefined){
            Geolocation.default_location.latitude = locations[campus]["latitude"];
            Geolocation.default_location.longitude = locations[campus]["longitude"];
        }
    },

    location_changed:  {"type": "location_changed"},

    location_updating:  {"type": "location_updating"},

    geolocation_status: { watchid: undefined },

    update_location: function () {
        // current user location is given more precedence over campus location.
        if (!Geolocation.get_is_using_location()) {
            Geolocation.set_campus_location();
        } else {
            Geolocation.query_client_location();
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

    get_latlng_from_coords: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },

    get_client_latlng: function () {
        var lat = sessionStorage.getItem("lat");
        var lng = sessionStorage.getItem("lng");
        return Geolocation.get_latlng_from_coords(lat, lng);
    },

    handle_watch_position: function (position) {
       if(Geolocation.get_is_using_location()){
           Geolocation.set_client_location(position);
       }
    },

    query_client_location: function() {
        // deal w/ error state
        if (navigator.geolocation) {
            Geolocation.geolocation_status.watchid =
                navigator.geolocation.watchPosition(
                    Geolocation.handle_watch_position,
                    function(){
                        $("#forget_location").trigger("click");
                        $("#geolocation_error").addClass("open");
                        $("#geolocation_error").removeClass("closed");
                    }
                );
        }
    },

    stop_watching_location: function(){
        var watchid = Geolocation.geolocation_status.watchid;
        if(watchid !== undefined){
            navigator.geolocation.clearWatch(watchid);
            Geolocation.geolocation_status.watchid = undefined;
        }
    },

    set_campus_location: function() {
        // get the campus from the url
        var campus = window.location.pathname.split('/')[1]

        Geolocation.campus_locations(campus);
        sessionStorage.setItem('lat', Geolocation.default_location.latitude);
        sessionStorage.setItem('lng', Geolocation.default_location.longitude);
        Geolocation.set_location_type("default");
        $.event.trigger(Geolocation.location_changed);
    },

    get_distance_from_position: function (item_latlng) {
        // Returns distance in miles, rounded to 2 decimals
        var current_latlng = Geolocation.get_client_latlng();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_latlng, item_latlng);
        var miles_per_meter = 0.000621371;
        distance = (distance * miles_per_meter).toFixed(2);
        return distance;

    },


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

};

/* node.js exports */
if (typeof exports == "undefined") {
    var exports = {};
}
exports.Geolocation = Geolocation;
