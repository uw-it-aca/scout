var Geolocation = {


    // native calls this function.. and passes user lat/lng to be stored in
    // session storage... overrides campus lat/lng
    set_user_location: function(lat, lng) {

        // clear any existing lat/lng before setting user's
        sessionStorage.setItem("lat", "");
        sessionStorage.setItem("lng", "");

        // user lat/lng
        sessionStorage.setItem("lat", lat);
        sessionStorage.setItem("lng", lng);
        //Geolocation.set_location_type("user");
    },

    set_campus_location: function() {

        // get the campus from the url
        var campus_lat = $("body").data("campus-latitude")
        var campus_lng = $("body").data("campus-longitude")

        sessionStorage.setItem("lat", "");
        sessionStorage.setItem("lng", "");
        
        sessionStorage.setItem('lat', campus_lat);
        sessionStorage.setItem('lng', campus_lng);
        //Geolocation.set_location_type("default");
    },

    get_client_latlng: function () {

        // user whaterver lat/lng is stored in sessi
        var lat = sessionStorage.getItem("lat");
        var lng = sessionStorage.getItem("lng");
        return Geolocation.get_latlng_from_coords(lat, lng);
    },

    get_latlng_from_coords: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },

    get_distance_from_position: function (item_latlng) {

        // Returns distance in miles, rounded to 2 decimals
        var current_latlng = Geolocation.get_client_latlng();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_latlng, item_latlng);
        var miles_per_meter = 0.000621371;
        distance = (distance * miles_per_meter).toFixed(2);
        return distance;

    },

    /**
    set_location_type: function (type) {
        // Values: 'default', 'supplied', 'user'
        // Session only
        sessionStorage.setItem("location_type", type);
    },

    get_location_type: function () {
         return sessionStorage.getItem("location_type") || 'default';
     },
     **/

    update_location: function () {
        // set campus lat/lng in session storage by default
        Geolocation.set_campus_location();
    },


};
