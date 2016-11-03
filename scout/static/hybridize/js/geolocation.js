var Geolocation = {

    /*
    set_client_location: function(lat, lng) {
        sessionStorage.setItem("lat", lat);
        sessionStorage.setItem("lng", lng);
    },
    */
    
    get_client_latlng: function () {

        // get latlng to default campus center
        var lat = $("#discover_cards").data("campus-latitude")
        var lng = $("#discover_cards").data("campus-longitude")

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

};
