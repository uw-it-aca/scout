Discover = {
    init_cards: function () {
        $(document).on("location_changed", function() {
            Geolocation.display_location_status();
            var discover_divs = $("#discover_cards").children();
            var latlng = Geolocation.get_client_latlng();
            $(discover_divs).each(function (idx, div){
                var card_id = $(div).attr('id');
                Discover.fetch_cards(card_id, latlng);
            });
        });
        $(document).on("location_updating", function() {
            Discover.set_cards_are_visible(false);
        });

        Geolocation.init_location_toggles();
    },

    fetch_cards: function (card_id, latlng) {
        var campus = Navigation.get_campus_selection();
        var url = "/" + campus + "/discover_card/" + card_id + "/";
        var pos_data = {"latitude": latlng.lat(),
            "longitude": latlng.lng()};
        $.ajax({
                   url: url,
                   dataType: "html",
                   type: "GET",
                   data: pos_data,
                   accepts: {html: "text/html"},
                   success: function(results) {
                       Discover._attach_card(card_id, results);
                       Discover._init_card_events(card_id);
                       Discover.add_distance_and_sort();
                       Discover.set_cards_are_visible(true);
                   },
                   error: function(xhr, status, error) {
                   }
               });
    },

    set_cards_are_visible: function(is_visible) {
        if(is_visible){
            $("#discover_cards").show();
            $("#card_loading_indicator").hide();
            $("#card_loading_indicator").attr("aria-hidden", "false");
        } else {
            $("#discover_cards").hide();
            $("#card_loading_indicator").show();
            $("#card_loading_indicator").attr("aria-hidden", "true");
        }
    },

    _attach_card: function (card_id, card_html) {
        $("#" + card_id).html(card_html);
        if(card_id === 'open'){
            Discover.initialize_map(card_id);
        }
    },

    add_distance_and_sort: function() {
        Discover._add_distance_to_spots();
        Discover._sort_spots_on_cards();
    },

    _add_distance_to_spots: function () {
        var cards = $(".scout-discover-content"),
            spots;
        $.each(cards, function(idx, card){
            spots = $(card).find("li");
            $.each(spots, function(idx, spot){
                var latitude = $(spot).attr("data-lat");
                var longitude = $(spot).attr("data-lon");
                var spot_latlng = Geolocation.get_latlng_from_coords(latitude, longitude);
                var distance = Geolocation.get_distance_from_position(spot_latlng);
                $(spot).find(".scout-spot-distance").html(distance);
            });
        });
    },

    _sort_spots_on_cards: function () {
        var cards = $(".scout-discover-content"),
            spots,
            spot_parent;
        $.each(cards, function(idx, card){
            spots = $(card).find("li");
            spot_parent = spots.parent();
            spots.detach().sort(function(a, b) {
                var a_distance = parseInt($($(a).find(".scout-spot-distance")[0]).html(), 10);
                var b_distance = parseInt($($(b).find(".scout-spot-distance")[0]).html(), 10);
                if(a_distance < b_distance){
                    return -1;
                } else if (a_distance > b_distance){
                    return 1;
                } else {
                    return 0;
                }
            });
            $(spot_parent).prepend(spots);
        });
    },

    _init_card_events: function (card_id) {
        // clear any previous set events for card
        $("#" + card_id).off();
        $("#" + card_id).mouseover(function(e){
            if (window.displayed_card !== card_id) {
                window.displayed_card = card_id;
                Discover.display_card_pins(this);
            }
        });
    },

    display_card_pins: function (card) {
        var spots = $(card).find("li");
        // remove the li that contains the View More button
        if(spots.length > 0 && $(spots[spots.length -1]).attr("id") == undefined){
            spots.splice(spots.length - 1, 1)
        }
        var spot_data = Discover.get_spot_locations(spots);
        Map.update_discover_map(spot_data);
    },

    get_spot_locations: function(spots){
        var spot_data = [];
        $.each(spots, function (idx, spot) {
            var url = $(spot).find("a").attr("href");
            var id = $(spot).attr("id");
            var lat = $(spot).attr("data-lat");
            var lng = $(spot).attr("data-lon");
            var spot_name = $(spot).attr("data-spot-name");
            var building = $(spot).attr("data-spot-building");

            // validate the spot data
            if(typeof id === "undefined" || typeof lat === "undefined" ||
                typeof lng === "undefined" || typeof spot_name === "undefined" ||
                typeof building === "undefined" )
                throw "Bad spot data!";

            spot_data.push({"url": url,
                            "id": id,
                            "lat": lat,
                            "lng": lng,
                            "spot_name": spot_name,
                            "building": building});
        });
        return spot_data;
    },

    initialize_map: function(card_id){
        var spots = $("#" + card_id).find("li");
        // remove the li that contains the View More button
        if(spots.length > 0 && $(spots[spots.length -1]).attr("id") == undefined){
            spots.splice(spots.length - 1, 1);
        }
        var spot_data = Discover.get_spot_locations(spots);
        Map.load_discover_map(spot_data);
    }
};
