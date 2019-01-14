var Geolocation = {

    get_latlng_from_coords: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },

    get_client_latlng: function () {

        // if the lat/lng is passed in query params... it's user location_changed
        // else.. just use the lat/lng in the data-attribute (dafault campus location)

        var lat, lng;

        if (Cookies.get("user_location")) {
            lat = Cookies.get("user_lat");
            lng = Cookies.get("user_lng");
            console.log("user latlng is: " + lat + ", " + lng)
        } else {
            lat = $("body").data("campus-latitude");
            lng = $("body").data("campus-longitude");
            console.log("default latlng is: " + lat + ", " + lng)
        }
        return Geolocation.get_latlng_from_coords(lat, lng);
    },

    get_distance_from_position: function (item_latlng) {
        // Returns distance in miles, rounded to 2 decimals
        var current_latlng = Geolocation.get_client_latlng();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_latlng, item_latlng);
        var miles_per_meter = 0.000621371;
        distance = (distance * miles_per_meter).toFixed(2);
        return distance;
    },

};
