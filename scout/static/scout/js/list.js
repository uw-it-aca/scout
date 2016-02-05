var List = {
    add_spot_distances: function () {
    var spots = $(".scout-list-item");

        $.each(spots, function(idx, item){
            var spot_id = $(item).attr('id');
            var spot_data = window.spot_locations[spot_id];
            var coords = new google.maps.LatLng(spot_data.lat, spot_data.lng);
            var distance = Map.get_distance_from_current_position(coords);
            $($(item).find(".distance-number")[0]).html(Math.round(distance * 3.280839895));
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

        $("#scout-list").append(spots);

    },
    update_spots_with_distance: function () {
        List.add_spot_distances();
        List.order_spot_list();
    }

};
