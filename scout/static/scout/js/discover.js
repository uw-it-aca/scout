Discover = {
    init_cards: function () {
        var discover_divs = $("#discover_cards").children();
        var latlng = Map.get_latlng();
        $(discover_divs).each(function (idx, div){
            var card_id = $(div).attr('id');
            Discover.fetch_cards(card_id, latlng);
        });
    },

    fetch_cards: function (card_id, latlng) {
        var url = "/discover_card/" + card_id + "/";
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
                },
                error: function(xhr, status, error) {
                }
        });
    },

    _attach_card: function (card_id, card_html) {
        $("#" + card_id).html(card_html);
    }
};