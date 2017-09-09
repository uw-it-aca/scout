var List = {

    init: function () {

        // Gets the current type the page is on!
        var currentType = $("body").data("app-type");

        if (currentType.indexOf("study") > -1) {

            List.add_distances("scout-list-item", "data-spot-lat", "data-spot-lng");
            List.add_distances("scout-list-building", "data-building-lat", "data-building-lng");
            List.order_list("scout-list-building", "scout_study_list", true);
            //List.defer_load_image();

        } else if (currentType.indexOf("tech") > -1)  {

            List.add_distances("scout-list-item", "data-spot-lat", "data-spot-lng");
            List.add_additional_tech_distances();
            List.order_list("scout-list-item", "scout_tech_list", false);
            //List.defer_load_image();

        } else if (currentType.indexOf("food") > -1) {

            List.add_distances("scout-list-item", "data-spot-lat", "data-spot-lng");
            List.order_list("scout-list-item", "scout_food_list", false);
            //List.defer_load_image();
        }

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

    add_additional_tech_distances: function() {
        var spots = $(".scout-list-item").not(".scout-error");
        $.each(spots, function(idx, item){
            var distance = $(item).attr("data-spot-distance");
            $.each($(item).find(".scout-list-item-object"), function(idx, item_object) {
                $(item_object).attr("data-spot-distance", distance);
                $($(item_object).find(".distance-number")[0]).html(distance);
            });
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
            // its faster to sort ints.
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

    fetch_spot_list: function(distance, limit, attacher, callback) {
        if (isNaN(distance) || isNaN(limit)) {
            console.log("Invalid distance and limit passed to fetch_spot_list");
            throw "InvalidParams";
        } else {
            var campus = $("body").data("campus");
            var app_type = $("body").data("app-type");
            // this will never be null/undefined
            var latlng = Geolocation.get_client_latlng();
            // get query params from the url
            var filter_params = location.search.substr(1);
            var query = {
                "latitude": latlng.lat(),
                "longitude": latlng.lng(),
                "limit": limit,
                "distance": distance
            };
            List._update_limit_param(app_type, limit);

            var url = "/h/" + campus + "/" + app_type + "/spot_list/?" + $.param(query);
            if (filter_params !== undefined && filter_params !== "") {
                url += "&" + filter_params;
            }
            console.log(url);

            $.ajax({
                url: url,
                dataType: "html",
                type: "GET",
                accepts: {
                    html: "text/html"
                },
                success: function(data) {
                    List._attach_spot_list(attacher, data);
                    List._update_spot_count(app_type, attacher);
                    if (callback) {
                        callback();
                    }
                    $("#content_placeholder").hide();
                    $("#" + attacher).fadeIn("slow");
                    $("#load_more_spot_list").fadeIn(3000);
                    List._attach_more_listener(app_type, attacher, callback);
                },
                error: function(xhr, status, error) {
                    console.log("An error occurred while fetching spot list for " + app_type);
                }
            });
        }
    },

    _attach_spot_list: function(attacher, list) {
        // attach html to list
        $("#" + attacher).html(list);
    },

    _update_spot_count: function(app_type, attacher) {
        // update the spot count with the current spots
        var length = 0;
        if (app_type == "tech") {
            length = $("#" + attacher).find(".scout-list-item-object").not(".scout-error").length;
            $("#spot_count").html(length + " items");
        } else {
            length = $("#" + attacher).find(".scout-list-item").not(".scout-error").length;
            $("#spot_count").html(length + " spaces");
        }
    },

    _attach_more_listener: function(app_type, attacher, callback) {
        // one makes sure multiple click listeners dont get attached to load more
        $("#load_more_spot_list").one("click", function() {
            var limit = List._get_limit_param(app_type);
            // we can make increment dynamic for each tab
            var increment = 20;
            List.fetch_spot_list(100000, limit + increment, attacher, callback);
        });
    },

    _get_limit_param: function(app_type) {
        var key = app_type + "_limit_param";
        var limit = JSON.parse(sessionStorage.getItem(key));
        if (!isNaN(limit)) {
            return limit;
        }
        return undefined;
    },

    _update_limit_param: function(app_type, limit) {
        var key = app_type + "_limit_param";
        if (!isNaN(limit)) {
            sessionStorage.setItem(key, JSON.stringify(limit));
        } else {
            console.log("Invalid limit provided at _update_limit_param");
        }
    },

    /**
    defer_load_image: function() {
        var spots = $(".image-defer");
        $.each(spots, function(idx, item){
            var imageUrl = $(this).data("defer-src");
            $(this).css('background-image', 'url(' + imageUrl + ')');
        });
    },
    **/

};
