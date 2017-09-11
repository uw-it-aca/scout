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
                    List._attach_spot_list(app_type, attacher, data);
                    List._update_spot_count(app_type, attacher);
                    if (callback) {
                        callback();
                    }
                    $("#content_placeholder").hide();
                    // $("#" + attacher).fadeIn("slow");
                    // $("#" + attacher).children().fadeIn("slow");
                    List._attach_more_listener(app_type, attacher, callback);
                },
                error: function(xhr, status, error) {
                    console.log("An error occurred while fetching spot list for " + app_type);
                }
            });
        }
    },

    _attach_spot_list: function(app_type, attacher, list) {
        // attach html to list
        $("#load_more_content_placeholder").fadeOut("slow");

        var id_list = List._get_spot_id_list(app_type, $("#" + attacher).html(), list);
        if (List._did_load_all_spots(id_list.existing_id_list, id_list.server_id_list)) {
            // all spots have loaded already
            // hide load more button, even though it should already be hidden
            // $("#load_more_spot_list").hide();
            console.log("reached the end of list");
        } else {
            list = List._prepare_fluid_transition(list, id_list);
            var currentPosition = $("body").scrollTop();
            $("#" + attacher).html(list);
            $("#" + attacher).children().fadeIn("slow");
            $("body").scrollTop(currentPosition);
            $("#load_more_spot_list").fadeIn(3000);
        }
    },

    // Returns the list of ids for each scout-list-item
    // existing_list and server_list are passed in as html string
    _get_spot_id_list: function(app_type, existing_list, server_list) {
        var existing_id_list = $(existing_list);
        var server_id_list = $(server_list);
        // for some weird reason, find is not an addition to filter.
        // since study has spots nested, find works for study and filter
        // works for other tabs.
        if (app_type == "study") {
            existing_id_list = $(existing_id_list).find(".scout-list-item");
            server_id_list = $(server_id_list).find(".scout-list-item");
        } else {
            existing_id_list = $(existing_id_list).filter(".scout-list-item");
            server_id_list = $(server_id_list).filter(".scout-list-item");
        }

        existing_id_list = $(existing_id_list)
                                .not(".scout-error")
                                .map(function(){
                                    return $(this).attr("id");
                                }).get();

        server_id_list = $(server_id_list)
                            .not(".scout-error")
                            .map(function(){
                                return $(this).attr("id");
                            }).get();

        return {
            "existing_id_list": existing_id_list,
            "server_id_list": server_id_list
        };
    },

    // Checks if the user has loaded all possible spots
    // Requires input of existing_id_list and server_id_list
    _did_load_all_spots: function(existing_id_list, server_id_list) {
        return $(existing_id_list).not(server_id_list).length == 0 &&
               $(server_id_list).not(existing_id_list).length == 0;
    },

    // to make the load more look more fluid, hide non-existent spots
    // then fade those spots into the div
    _prepare_fluid_transition: function(html_list, id_list) {
        var hidden_id_list = $(id_list.server_id_list).not(id_list.existing_id_list);
        html_list = $.parseHTML(html_list);
        $.each(hidden_id_list, function(index, hidden_id) {
            $(html_list).filter("#" + hidden_id).css("display", "none");
        });
        return html_list;
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
            $("#load_more_spot_list").hide();
            $("#load_more_content_placeholder").fadeIn("slow");
            var limit = List.get_limit_param(app_type);
            // we can make increment dynamic for each tab
            var increment = 20;
            List.fetch_spot_list(100000, limit + increment, attacher, callback);
        });
    },

    get_limit_param: function(app_type) {
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
