var List = {

    init: function () {


        List.add_distances("scout-list-item", "data-spot-lat", "data-spot-lng");

        // Gets the current type the page is on!
        var currentType = $(".list-group").data("app-type")

        console.log(currentType);

        if (currentType.indexOf("study") > -1) {

            List.add_distances("scout-list-building", "data-building-lat", "data-building-lng");
            List.order_list("scout-list-building", "scout_study_list", true);

        } else if (currentType.indexOf("tech") > -1)  {

            List.add_additional_tech_distances();
            List.order_list("scout-list-item", "scout_tech_list", false);

        } else {

            List.order_list("scout-list-item", "scout_food_list", false);
        }


        //Geolocation.init_location_toggles();
    },

    add_distances: function (className, latAttr, lngAttr) {
        var objects = $("." + className).not(".scout-error");

        $.each(objects, function(index, object){

            var lat = $(object).attr(latAttr);
            var lng = $(object).attr(lngAttr);

            var latlng = Geolocation.get_latlng_from_coords(lat, lng);
            var distance = Geolocation.get_distance_from_position(latlng);

            $(object).attr("data-spot-distance", distance);
            $($(object).find(".distance-number")[0]).html(distance);
        });
    },

    order_list: function (className, listName, isBuilding) {
        var objects = $("." + className).not(".scout-error").detach();
        if(isBuilding) {
            $.each(objects, function(idx, object){
                var spots = $(object).find(".scout-list-item").detach();
                var spot_ol = $(object).find(".scout_study_spot_list");
                $(spot_ol[0]).append(List.sort_spots_by_distance(spots));
            });
        }
        objects = List.sort_spots_by_distance(objects);
        $("#" + listName).append(objects);
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

};
