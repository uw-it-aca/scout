var List = {
    add_spot_distances: function () {
        var spots = $(".scout-list-item");

        $.each(spots, function(idx, item){
            var lat = $(item).attr("data-spot-lat");
            var lng = $(item).attr("data-spot-lng");

            var spot_latlng = Geolocation.get_latlng_from_coords(lat, lng);
            var distance = Geolocation.get_distance_from_position(spot_latlng);
            $(item).attr("data-spot-distance", distance);
            $($(item).find(".distance-number")[0]).html(distance);
        });
    },

    order_spot_list: function () {
        var spots = $(".scout-list-item").detach();
        var sorted_spots = List.sort_spots_by_distance(spots);
        $("#scout_food_list").append(sorted_spots);
    },

    sort_spots_by_distance: function(spots) {
        spots.sort(function(a, b) {
            var a_distance = parseFloat($(a).attr('data-spot-distance'));
            var b_distance = parseFloat($(b).attr('data-spot-distance'));
            if(a_distance < b_distance){
                return -1;
            } else if (a_distance > b_distance){
                return 1;
            } else {
                return 0;
            }
        });
        return spots;
    },

    add_building_distances: function () {
        var buildings = $(".scout-list-building");

        $.each(buildings, function(idx, building){
            var lat = $(building).attr('data-building-lat');
            var lng = $(building).attr('data-building-lng');
            var building_latlng = Geolocation.get_latlng_from_coords(lat, lng);
            var distance = Geolocation.get_distance_from_position(building_latlng);
            $(building).attr('data-spot-distance', distance);
        });

    },

    sort_buildings: function () {
        var buildings = $(".scout-list-building").detach();
        var sorted_spots = List.sort_spots_by_distance(buildings);
        $("#scout_study_list").append(sorted_spots);
    },


    add_geodata_to_study_list: function () {
        List.add_spot_distances();
        List.add_building_distances();
        List.sort_buildings();
    },

    add_geodata_to_other_list: function () {
        List.add_spot_distances();
        List.order_spot_list();
    },


    init: function () {
        $(document).on("location_changed", function() {
            //Geolocation.display_location_status();
            var page_path = window.location.pathname;
            if (page_path.indexOf("study") !== -1){
                List.add_geodata_to_study_list();
            } else {
                List.add_geodata_to_other_list();
            }
            List.set_list_is_visible(true);
        });
        $(document).on("location_updating", function() {
            List.set_list_is_visible(false);

        });
        Geolocation.init_location_toggles();
    },

    set_list_is_visible: function(is_visible) {
        if(is_visible){
            $("#scout_food_list").show();
        } else {
            $("#scout_food_list").hide();
        }
    },

    scroll_to_spot: function(target, options, callback) {

        if (typeof options == 'function' && arguments.length == 2) {
            callback = options;
            options = target;
        }
        var settings = $.extend({
            scrollTarget: target,
            offsetTop: 130,
            duration: 400,
            //easing: 'swing'
        }, options);

        var scrollPane = $('html, body');
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({
            scrollTop: scrollY
        }, parseInt(settings.duration), settings.easing, function() {
            if (typeof callback == 'function') {
                callback.call(this);
            }
        });

    },

    get_spot_locations: function(){
        var spot_data = []
        var spots = $(".scout-list-item");
        $.each(spots, function (idx, spot) {
            var id = $(spot).attr("id");
            var lat = $(spot).attr("data-spot-lat");
            var lng = $(spot).attr("data-spot-lng");
            var spot_name = $(spot).attr("data-spot-name");
            var building = $(spot).attr("data-spot-building");
            spot_data.push({"id": id,
                             "lat": lat,
                             "lng": lng,
                             "spot_name": spot_name,
                             "building": building})
        });
        return spot_data
    }

};

/* node.js exports */
if (typeof exports == "undefined") {
    var exports = {};
}
exports.List = List;
