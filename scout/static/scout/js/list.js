var List = {
    add_spot_distances: function () {
        var spots = $(".scout-list-item");

        $.each(spots, function(idx, item){
            var spot_id = $(item).attr('id');
            if(spot_id !== undefined){
                var spot_data = window.spot_locations[spot_id];
                var spot_latlng = Geolocation.get_latlng_from_coords(spot_data.lat, spot_data.lng);
                var distance = Geolocation.get_distance_from_position(spot_latlng);
                $($(item).find(".distance-number")[0]).html(distance);
            }
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
            Geolocation.display_location_status();
            List.add_spot_distances();
            List.order_spot_list();
            List.set_list_is_visible(true);
        });
        window.addEventListener('location_updating', function() {
            List.set_list_is_visible(false);

        });
        Geolocation.init_location_toggles();
    },

    set_list_is_visible: function(is_visible) {
        if(is_visible){
            $("#scout_list").show();
            $("#list_loading").hide();
            $("#list_loading").attr("aria-hidden", "false");
        } else {
            $("#scout_list").hide();
            $("#list_loading").show();
            $("#list_loading").attr("aria-hidden", "false");
        }
    },

    scroll_to_spot: function(target, options, callback) {

        if (typeof options == 'function' && arguments.length == 2) {
            callback = options;
            options = target;
        }
        var settings = $.extend({
            scrollTarget: target,
            offsetTop: 140,
            duration: 400,
            //easing: 'swing'
        }, options);

        var scrollPane = $('.scout-scroll');
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({
            scrollTop: scrollY
        }, parseInt(settings.duration), settings.easing, function() {
            if (typeof callback == 'function') {
                callback.call(this);
            }
        });

    }

};
