var List = {

    init: function () {

        // Gets the current type the page is on!
        var currentType = $("body").data("app-type")

        if (currentType.indexOf("study") > -1) {

            List.add_distances("scout-list-item", "data-spot-lat", "data-spot-lng");
            List.add_distances("scout-list-building", "data-building-lat", "data-building-lng");
            //List.order_list("scout-list-building", "scout_study_list", true);
            //List.defer_load_image();

        } else if (currentType.indexOf("tech") > -1)  {

            List.add_distances("scout-list-item", "data-spot-lat", "data-spot-lng");
            List.add_additional_tech_distances();
            //List.order_list("scout-list-item", "scout_tech_list", false);
            //List.defer_load_image();

        } else {

            List.add_distances("scout-list-item", "data-spot-lat", "data-spot-lng");

            //List.order_list("scout-list-item", "scout_food_list", false);
            //List.defer_load_image();
        }

    },

    add_spot_data_to_list: function(campus) {
        // Compile template with Handlebars
        var source = $("#study-list-module").html();
        var template = Handlebars.compile(source);
        // load json payload using ajax request
        $.ajax({
            url: "/" + campus + "/api/study/",
            type: 'get',
            success: function(data) {
                //If the success function is execute,
                //then the Ajax request was successful.
                var isource = $("#study-list-module-component").html();
                var itemplate = Handlebars.compile(isource);
                $("#scout_study_list").html("");
                $.each(data, function(index, object) {
                    List.load_spot_details(template, itemplate, object, campus);
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText);
            }
        });
    },

    load_spot_details: function(outer_template, inner_template, object, campus) {
        var spot_html = "";
        var promises = [];
        $.each(object["spots"], function(index, bare_spot) {
            var request = $.ajax({
                url: "/" + campus + "/api/study/" + bare_spot["spot_id"] + "/",
                type: 'get',
                success: function(spot) {
                    if ($.isEmptyObject(spot)) {
                        console.log(bare_spot["spot_id"] + " doesn't have any data");
                    } else {
                        spot_html += inner_template({
                            spot: spot,
                            campus: campus
                        });
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Request failed for spot : " + bare_spot["spot_id"]);
                    console.log(xhr.responseText);
                }
            });
            promises.push(request);
        });
        $.when.apply(null, promises).done(function(){
            $("#scout_study_list").append(outer_template({
                object: object,
                inner_html: spot_html
            }));
        });
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

    /**
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

    defer_load_image: function() {
        var spots = $(".image-defer");
        $.each(spots, function(idx, item){
            var imageUrl = $(this).data("defer-src");
            $(this).css('background-image', 'url(' + imageUrl + ')');
        });
    },
    ***/

};
