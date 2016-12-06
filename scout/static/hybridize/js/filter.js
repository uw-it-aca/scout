var Filter = {

    get_filter_url: function(type) {
        var filter = {};
        if(type.indexOf("food") > -1) {
            filter = Food_Filter.get_filter_url();
        } else if(type.indexOf("study") > -1) {
            filter = Study_Filter.get_filter_url();
        } else if(type.indexOf("tech") > -1) {
            filter = Tech_Filter.get_filter_url();
        }

        if(filter === undefined || $.isEmptyObject(filter)){
            return undefined;
        }
        return $.param(filter);
    },

    _get_params_for_select: function(select_results, prefix) {
        var params = {};
        if(select_results !== null && select_results.length > 0){
            $.each(select_results, function(idx, result){
                params[prefix + idx] = result;
            });
        }
        return params;

    },

    _get_filter_label_text: function(){
        var url = window.location.href;
        var filter_categories = [];
        var specific_categories = [];

        var type = $("body").data("app-type")

        if(type.indexOf("food") > -1) {
            specific_categories = Food_Filter._get_filter_label_text(url);
        } else if(type.indexOf("study") > -1) {
            specific_categories = Study_Filter._get_filter_label_text(url);
        } else if(type.indexOf("tech") > -1) {
            specific_categories = Tech_Filter._get_filter_label_text(url);
        }
        $.merge(filter_categories, specific_categories);

        var filter_string = "";
        for(var i = 0; i < filter_categories.length; i++){
            filter_string += filter_categories[i];
            if (i < filter_categories.length - 1){
                filter_string += ", ";
            }
        }

        return filter_string;
    },

    set_filter_text: function(){
        // this will now have a paramater, so it can set the filter text
        // based on what it recieves as a parameter.

        var filter_text = Filter._get_filter_label_text();
        if(filter_text.length > 0){
            $("#filter_label_text").html(filter_text);
            $("#filter_text_holder").removeClass("visually-hidden");
            $("#reset_food_list").removeClass("visually-hidden");
            $("#reset_study_list").removeClass("visually-hidden");
            $("#reset_tech_list").removeClass("visually-hidden");
        }
    },

    /**
    reset_filter: function(sessionVar, type) {
        // this will now have a paramater, so it can set the delete app type
        // specific filters.
        sessionStorage.removeItem(sessionVar);
        Filter.replace_navigation_href();
        Filter.redirect_to_page(type);
    },
    **/

    init_events: function() {

        Filter.set_filter_text();
        Filter.init_hybrid_events();

        // initial app_type specific events (if needed)
        Food_Filter.init_events(); // empty
        Study_Filter.init_events(); // handles building and hours toggle
        Tech_Filter.init_events(); // empty

    },

    /**
    redirect_to_page: function(type) {
        var campus = Navigation.get_campus_selection();
        var filter_url = Filter.get_filter_url(type);

        if (filter_url !== undefined){
            window.location.href = "/"+ campus + type + "?" + filter_url;
        } else {
            window.location.href = "/" + campus + type;
        }
    },
    **/

    /**
    get_current_type: function() {

        var current_page = window.location.pathname;

        if (current_page.indexOf("study") > -1){
            return "/study/";
        } else if (current_page.indexOf("tech") > -1){
            return "/tech/";
        } else if (current_page.indexOf("food") > -1){
            return "/food/";
        } else {
            return "/";
        }

        return current_page;
    },
    **/

    init: function() {
        // we can include type as a parameter and web.js
        // pas that!
        var type = $("body").data("app-type")

        if(type.indexOf("food") > -1) {
            Food_Filter.populate_filters_from_saved();
        } else if(type.indexOf("study") > -1) {
            Study_Filter.populate_filters_from_saved();
            Study_Filter.populate_hour_filters();
        } else if(type.indexOf("tech") > -1) {
            Tech_Filter.populate_filters_from_saved();
        }
    },

    populate_filters_from_saved: function(sessionVar, param_types) {

        var params = JSON.parse(sessionStorage.getItem(sessionVar));

        if(params == undefined){
            return;
        }

        $.each(params, function(param_key, param_val){
            $.each(param_types, function(type_key, type_val){
                if(param_key.indexOf(type_key) > -1){
                    // find a better way to find out the input val!
                    var type = "input";
                    var state = "checked";
                    if (type_key == "building" || type_key == "capacity") {
                        type = "option";
                        state = "selected";
                        // need better way to handle when building is selected
                        if (type_key == "building") {
                            $("#buildings_toggle").find("input[value=building_list]").prop("checked", true);
                            $("#building_select").removeClass("visually-hidden");
                        }
                    }
                    if (param_key == "open_now") {
                        param_val = "open_now";
                    }
                    var item = $("#" + type_val).find(type + "[value='" + param_val + "']");
                    $(item[0]).prop(state, true);
                }
            });
        });
    },

    /**
    replace_navigation_href: function(){
        var anchors = {
            "/food/" : "#link_food",
            "/study/" : "#link_study",
            "/tech/" : "#link_tech",
        };

        for (anchor in anchors){
            // build the url with filtered params
            var filter = Filter.get_filter_url(anchor);
            var anchor_id = $(anchors[anchor]);
            if (filter !== undefined){
                filter = anchor_id.attr("href") + "?" + filter;
            }
            anchor_id.attr("href", filter);
        }
    },
    **/

    /**** NEW STUFF... HYBRID ONLY ***/

    init_hybrid_events: function () {

        var type = $("body").data("app-type")

        var params = {};

        // handle native submit click from native
        $("#filter_submit").click(function(e) {

            // set filter params and call native bridge (on back button click)

            if(type.indexOf("food") > -1) {
                Food_Filter.set_filter_params();
            } else if(type.indexOf("study") > -1) {
                Study_Filter.set_filter_params();
            } else if(type.indexOf("tech") > -1) {
                Tech_Filter.set_filter_params();
            }

        });

        // reset form
        $('#filter_clear').click(function(e) {

            // clear params
            $('#scout_filter').trigger("reset");
            $('#scout_filter input:checkbox').removeAttr('checked');
            $('#scout_filter input:radio').removeAttr('checked');

            // set emptied filter params and call native bridge
            if(type.indexOf("food") > -1) {
                Food_Filter.set_filter_params();
            } else if(type.indexOf("study") > -1) {
                // reset the following radio buttons when clearing
                $('#hours_toggle input:radio[value="open_now"]').prop("checked", true)
                $('#buildings_toggle input:radio[value="entire_campus"]').prop("checked", true)
                Study_Filter.set_filter_params();
            } else if(type.indexOf("tech") > -1) {
                Tech_Filter.set_filter_params();
            }

        });

        $('#scout_filter li').each(function(e) {
            $(this).change(function () {

                // set filter params and call native bridge (on every click)
                if(type.indexOf("food") > -1) {
                    Food_Filter.set_filter_params();
                } else if(type.indexOf("study") > -1) {
                    Study_Filter.set_filter_params();
                } else if(type.indexOf("tech") > -1) {
                    Tech_Filter.set_filter_params();
                }

            })
        });

    },

    call_js_bridge: function(params) {

        // get the device type
        var device = $("body").data("device");

        try {
            // check device and handle js bridge accordingly
            if (device == "android") {
                scoutBridge.setParams(params);
            } else if (device == 'ios') {
                webkit.messageHandlers.scoutBridge.postMessage(params)
            }

        } catch(err) {
            // no bridge could be found
            console.log('The native context does not exist yet');
        }

    },

};
