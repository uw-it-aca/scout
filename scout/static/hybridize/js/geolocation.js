var Geolocation = {
  get_latlng_from_coords: function(lat, lng) {
    return new google.maps.LatLng(lat, lng);
  },

  get_client_latlng: function(hlat, hlng) {
    var lat, lng;

    // make sure user coords are passed
    if (hlat && hlng) {
      //user coords passed to geolocation
      lat = hlat;
      lng = hlng;
    } else {
      // using default coords on geolocation
      lat = $("body").data("campus-latitude");
      lng = $("body").data("campus-longitude");
    }

    return Geolocation.get_latlng_from_coords(lat, lng);
  },

  get_distance_from_position: function(item_latlng, hlat, hlng) {
    // Returns distance in miles, rounded to 2 decimals
    var current_latlng = Geolocation.get_client_latlng(hlat, hlng);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      current_latlng,
      item_latlng
    );
    var miles_per_meter = 0.000621371;
    distance = (distance * miles_per_meter).toFixed(2);
    return distance;
  },

  getNativeLocation: function(hlat, hlng) {
    // render the webview
    WebView.render(hlat, hlng);
  },

  getReverseGeocodingData: function(hlat, hlng) {
    // perform reverse geocoding using openstreetmap.org nominatim api
    $.getJSON('https://nominatim.openstreetmap.org/reverse', {
      lat: hlat,
      lon: hlng,
      format: 'json',
      zoom: 21
    }, function (result) {
      console.log(result);

      // display the user location via reverse geolocation lookup
      var houseOffset = result.address.house_number == undefined ? 0 : 1;
      var geoDisplay = result.display_name.split(", ").slice(0 + houseOffset,3 + houseOffset).join(", ");

      $("#hybrid_location_bridge").html(geoDisplay);

    });

  }

};
