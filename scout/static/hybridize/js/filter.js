Filter = {

    init_filter: function () {

        var params = {};

        // handle native submit click from native
        $("#filter_submit").click(function(e) {
            // 1. process the web form and generate the query param
            // 2. call the native app and pose the query param as a "message"
            //params = "?period0=late_night"
            //Filter.call_js_bridge(params);

            Filter.set_filter_params();

        });

        // reset form
        $('#filter_clear').click(function(e) {

            // clear params
            $('#scout_filter').trigger("reset");
            $('#scout_filter input:checkbox').removeAttr('checked');
            $('#scout_filter input:radio').removeAttr('checked');

            // set emptied filter params and call native bridge
            Filter.set_filter_params();

        });

        $('#scout_filter li').each(function(e) {
            $(this).change(function () {

                // set filter params and call native bridge
                Filter.set_filter_params();
            })
        });

    },

    set_filter_params: function(){
        // similar implementation as the current filter.js for this
        // method. This just specifically gets params set for
        // food filters.html.

        var params = {};
        var param_types = {

            //global
            "type": "type_select input:checkbox:checked",

            // food
            "payment": "payment_select input:checkbox:checked",
            "period": "period_select input:checkbox:checked",

            // study
            "building": "building_select option:selected",
            "resources": "resources_select input:checkbox:checked",
            "noise": "noise_select input:checkbox:checked",
            "food": "food_select input:checkbox:checked",
            "lighting": "lighting_select input:checkbox:checked",
            "reservation": "reserve_select input:checkbox:checked",
            "capacity": "capacity_select option:selected",

            // tech
            "brand": "brand_select input:checkbox:checked",
            "subcategory": "subcategory_select input:checkbox:checked",
        };

        $.each(param_types, function(type, param){
            var result = $("#" + param).map(function() {

                if(type == "capacity" && val == "1") {
                    val = null;
                } else if (type == "building" && $("#buildings_toggle input:checked").val() == "entire_campus") {
                    val = null;
                }

                return $(this).val();
            }).get();
            params = $.extend(params, Filter._get_params_for_select(result, type));
        });

        if($("#open_now input").is(":checked")){
            params = $.extend(params, {"open_now": true});
        }

        console.log($.param(params));

        // pass the params to native apps via bridge
        Filter.call_js_bridge($.param(params));
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

    set_filter_text: function(){
        // this will now have a paramater, so it can set the filter text
        // based on what it recieves as a parameter.

        var filter_text = Filter._get_filter_label_text();
        if(filter_text.length > 0){
            $("#filter_label_text").html(filter_text);
        }
    },

    _get_filter_label_text: function(){
        var url = window.location.href;
        //var type = Filter.get_current_type();
        var filter_categories = [];
        var specific_categories = [];

        // Gets the current type the page is on!
        var currentType = $("body").data("app-type")

        if(currentType.indexOf("food") > -1) {
            specific_categories = Filter._get_food_filter_label_text(url);
        } else if(currentType.indexOf("study") > -1) {
            specific_categories = Filter._get_study_filter_label_text(url);
        } else if(currentType.indexOf("tech") > -1) {
            specific_categories = Filter._get_tech_filter_label_text(url);
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

    _get_food_filter_label_text: function(url){
        // similar implementation as the current filter.js for
        // this method. More food specific.

        var filter_categories = [];
        filter_labels = {
            "payment": "Payment Accepted",
            "type": "Restaurant Type",
            "period": "Open Period",
            "open_now": "Open Now",

        };
        $.each(filter_labels, function(filter, label){
            if(url.indexOf("&" + filter) > -1 || url.indexOf("?" + filter) > -1){
                filter_categories.push(label);
            }
        });
        return filter_categories;
    },

    _get_study_filter_label_text: function(url){
        // similar implementation as the current filter.js for
        // this method. More study specific.

        var filter_categories = [];
        filter_labels = {
            "building": "Building",
            "type": "Study Type",
            "food": "Refreshments",
            "lighting": "Lighting",
            "noise": "Noise Level",
            "resources": "Resources",
            "reservation": "Reservability",
            "capacity": "Capacity",
            "open_at": "Hours"
        };
        $.each(filter_labels, function(filter, label){
            if(url.indexOf(filter) > -1){
                filter_categories.push(label);
            }
        });

        // Temporary fix for adding Open Now as a filter text.
        if (!(filter_categories.indexOf("Hours") > -1)) {
            filter_categories.push("Open Now");
        }

        return filter_categories;
    },

    _get_tech_filter_label_text: function(url){
        // similar implementation as the current filter.js for
        // this method. More tech specific.

        var filter_categories = [];
        filter_labels = {
            "brand": "Brand",
            "subcategory": "Type",
        };
        $.each(filter_labels, function(filter, label){
            if(url.indexOf("&" + filter) > -1 || url.indexOf("?" + filter) > -1){
                filter_categories.push(label);
            }
        });
        return filter_categories;
    },

    call_js_bridge: function(params) {

        // get the device type
        var device = $("body").data("device");

        try {
            // check device and handle js bridge accordingly
            if (device == "android") {
                scoutBridge.showToast(params);
            } else if (device == 'ios') {
                webkit.messageHandlers.scoutBridge.postMessage(params)
            }

        } catch(err) {
            // no bridge could be found
            console.log('The native context does not exist yet');
        }

    },

};
