Discover = {

    init_cards: function () {

        $(document).on("location_changed", function() {

            var discover_divs = $("#discover_cards").children();

            var latlng = Geolocation.get_client_latlng();

            $(discover_divs).each(function (idx, div){
                var card_id = $(div).attr('id');
                Discover.fetch_cards(card_id, latlng);
            });



        });

    },

    fetch_cards: function (card_id , latlng) {

        //var campus = Navigation.get_campus_selection();
        var campus = $("body").data("campus")

        var url = "/h/" + campus + "/discover_card/" + card_id + "/";

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
                       //Discover._init_card_events(card_id);
                       Discover.add_distance_and_sort();
                       //Discover.set_cards_are_visible(true);
                       $("#discover_cards").removeClass("visually-hidden");
                   },
                   error: function(xhr, status, error) {
                   }
               });
    },

    set_cards_are_visible: function(is_visible) {
        if(is_visible){
            $("#discover_cards").show();
        } else {
            $("#discover_cards").hide();
        }
    },

    _attach_card: function (card_id, card_html) {
        $("#" + card_id).html(card_html);
        if(card_id === 'open'){
            //Discover.initialize_map(card_id);
        }
    },

    add_distance_and_sort: function() {
        Discover._add_distance_to_spots();
        Discover._sort_spots_on_cards();
    },

    _add_distance_to_spots: function () {
        var cards = $(".card"),
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
        var cards = $(".card"),
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

};
