Discover = {

    init_cards: function (crd) {

      // make sure user coords are passed
      if (crd) {
        console.log("user coords passed to discover");
        //console.log(crd);
      } else {
        console.log("using default coords");
      }


      var discover_divs = $("#discover_cards").children();

      // get the client lat/lng
      //var latlng = Geolocation.get_client_latlng(crd);

      $(discover_divs).each(function (idx, div){
          var card_id = $(div).attr('id');
          // ignore if its a static card
          if (card_id && card_id !== "TECH_STATIC") {

              //Discover.fetch_cards(card_id, latlng);
              Discover.fetch_cards(card_id, crd);

          } else {
              $("#" + card_id).fadeIn(3000);
          }
      });

    },

    fetch_cards: function (card_id , crd) {

        //var campus = Navigation.get_campus_selection();
        var campus = $("body").data("campus");

        var url = "/h/" + campus + "/discover_card/" + card_id + "/";

        var pos_data = {}

        if (crd) {
          console.log("fetch cards using user coords");

          pos_data = {
              "latitude": crd.latitude,
              "longitude": crd.longitude
          };

          //console.log(crd);
        } else {
          console.log("fetch cards using default coords");

          //lat = $("body").data("campus-latitude");
          //lng = $("body").data("campus-longitude");

          pos_data = {
              "latitude": $("body").data("campus-latitude"),
              "longitude": $("body").data("campus-longitude")
          };

        }

        /**
        // change the request params based on user location (h_lat/h_lng) or default (latitude/longitude)
        if ( $("body").data("user-latitude") && $("body").data("user-longitude") ) {
          pos_data = {
              "h_lat": crd.latitude,
              "h_lng": crd.longitude
          };
        } else {
          pos_data = {
              "latitude": crd.latitude,
              "longitude": crd.longitude
          };
        }
        **/

        $.ajax({
            url: url,
            dataType: "html",
            type: "GET",
            data: pos_data,
            accepts: {html: "text/html"},
            success: function(results) {
                Discover._attach_card(card_id, results);
                //Discover._init_card_events(card_id);
                Discover.add_distance_and_sort(card_id, crd);
                //Discover.set_cards_are_visible(true);
                //$("#discover_cards").removeClass("visually-hidden");
                $("#discover_loading").hide();
                $("#" + card_id).fadeIn("slow");
            },
            error: function(xhr, status, error) {
                console.log("An error occurred fetching card " + card_id);
            }
        });
    },

    /*set_cards_are_visible: function(is_visible) {
        if(is_visible){
            $("#discover_cards").show();
        } else {
            $("#discover_cards").hide();
        }
    },*/

    _attach_card: function (card_id, card_html) {
        $("#" + card_id).html(card_html);
        //if(card_id === 'open'){
            //Discover.initialize_map(card_id);
        //}
    },

    add_distance_and_sort: function(card_id, crd) {
        Discover._add_distance_to_spots(card_id, crd);
        Discover._sort_spots_on_cards(card_id, crd);
    },

    _add_distance_to_spots: function (card_id, crd) {
        var spots = $("#" + card_id).find("li");
        $.each(spots, function(idx, spot){

            var latitude = $(spot).attr("data-lat");
            var longitude = $(spot).attr("data-lon");

            var spot_latlng = Geolocation.get_latlng_from_coords(latitude, longitude);
            var distance = Geolocation.get_distance_from_position(spot_latlng, crd);

            $(spot).find(".scout-spot-distance").html(distance);
            $(spot).attr("data-spot-distance", distance);
        });
    },

    _sort_spots_on_cards: function (card_id) {
        var spots = $("#" + card_id).find("li");
        var spot_parent = spots.parent();
        spots.detach().sort(function(a, b) {
            var a_distance = parseFloat($(a).attr('data-spot-distance'));
            var b_distance = parseFloat($(b).attr('data-spot-distance'));
            // its faster to sort ints.
            if(a_distance < b_distance){
                return -1;
            } else if (a_distance > b_distance){
                return 1;
            } else {
                return 0;
            }
        });
        spot_parent.append(spots);
    },

};
