Discover = {
  init_cards: function(hlat, hlng) {
    var discover_divs = $("#discover_cards").children();

    $(discover_divs).each(function(idx, div) {
      var card_id = $(div).attr("id");

      // ignore if its a static card
      if (card_id && card_id !== "TECH_STATIC") {
        Discover.fetch_cards(card_id, hlat, hlng);
      } else {
        $("#" + card_id).fadeIn(3000);
      }
    });
  },

  fetch_cards: function(card_id, hlat, hlng) {
    var campus = $("body").data("campus");
    var url = "/h/" + campus + "/discover_card/" + card_id + "/";
    var pos_data = {};

    if (hlat && hlng) {
      pos_data = {
        latitude: hlat,
        longitude: hlng
      };
    } else {
      pos_data = {
        latitude: $("body").data("campus-latitude"),
        longitude: $("body").data("campus-longitude")
      };
    }

    $.ajax({
      url: url,
      dataType: "html",
      type: "GET",
      data: pos_data,
      accepts: { html: "text/html" },
      success: function(results) {
        Discover._attach_card(card_id, results);
        Discover.add_distance_and_sort(card_id, hlat, hlng);

        // hide the placeholder
        setTimeout(function() {
          $("#discover_loading").hide();
          $("#discover_cards").removeClass("visually-hidden");
        }, 1500);

        $("#" + card_id).fadeIn("slow");
      },
      error: function(xhr, status, error) {
        // console.log("An error occurred fetching card " + card_id);

        // hide the placeholder
        setTimeout(function () {
          $("#discover_loading").hide();
          $("#discover_cards").removeClass("visually-hidden");
        }, 3000);
      }
    });
  },

  _attach_card: function (card_id, card_html) {
    $("#" + card_id).html(card_html);
  },

  add_distance_and_sort: function(card_id, hlat, hlng) {
    Discover._add_distance_to_spots(card_id, hlat, hlng);
    Discover._sort_spots_on_cards(card_id, hlat, hlng);
  },

  _add_distance_to_spots: function(card_id, hlat, hlng) {
    var spots = $("#" + card_id).find("li");
    $.each(spots, function(idx, spot) {
      var latitude = $(spot).attr("data-lat");
      var longitude = $(spot).attr("data-lon");

      var spot_latlng = Geolocation.get_latlng_from_coords(latitude, longitude);
      var distance = Geolocation.get_distance_from_position(
        spot_latlng,
        hlat,
        hlng
      );

      $(spot)
        .find(".scout-spot-distance")
        .html(distance);
      $(spot).attr("data-spot-distance", distance);
    });
  },

  _sort_spots_on_cards: function(card_id) {
    var spots = $("#" + card_id).find("li");
    var spot_parent = spots.parent();
    spots.detach().sort(function(a, b) {
      var a_distance = parseFloat($(a).attr("data-spot-distance"));
      var b_distance = parseFloat($(b).attr("data-spot-distance"));
      // its faster to sort ints.
      if (a_distance < b_distance) {
        return -1;
      } else if (a_distance > b_distance) {
        return 1;
      } else {
        return 0;
      }
    });
    spot_parent.append(spots);
  },





};
