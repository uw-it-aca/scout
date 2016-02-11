Discover = {
    init_cards: function () {
        var discover_divs = $("#discover_cards").children();
        $(discover_divs).each(function (idx, div){
            var card_id = $(div).attr('id');
            Discover.fetch_cards(card_id);
        });
    },

    fetch_cards: function (card_id) {
        var url = "/discover_card/" + card_id + "/";
        $.ajax({
                url: url,
                dataType: "html",

                type: "GET",
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