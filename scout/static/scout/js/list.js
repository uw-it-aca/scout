var List = {
    add_spot_distances: function () {
        var spots = $(".scout-list-item");

        $.each(spots, function(idx, item){
            var spot_id = $(item).attr('id');
            var spot_data = window.spot_locations[spot_id];
            var spot_latlng = Geolocation.get_latlng_from_coords(spot_data.lat, spot_data.lng);
            var distance = Geolocation.get_distance_from_position(spot_latlng);
            $($(item).find(".distance-number")[0]).html(distance);
        });
    },

    order_spot_list: function () {

        var spots = $(".scout-list-item");
        spots.detach().sort(function(a, b) {
            var a_distance = parseInt($($(a).find(".distance-number")[0]).html(), 10);
            var b_distance = parseInt($($(b).find(".distance-number")[0]).html(), 10);
            if(a_distance < b_distance){
                return -1;
            } else if (a_distance > b_distance){
                return 1;
            } else {
                return 0;
            }
        });

        $("#scout_list").append(spots);
    },

    init: function () {
        window.addEventListener('location_changed', function() {
            List.add_spot_distances();
            List.order_spot_list();
            Geolocation.display_location_status();
        });
        Geolocation.init_location_toggles();
    }
};
