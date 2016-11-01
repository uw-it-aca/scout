Filter = {

    init_filter: function () {

        var params = {};

        // handle native submit click from native
        $("#filter_submit").click(function(e) {
            // 1. process the web form and generate the query param
            // 2. call the native app and pose the query param as a "message"
            //params = "?period0=late_night"
            //Filter.call_js_bridge(params);

            //Filter.set_filter_params();

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
            "payment": "payment_select input:checkbox:checked",
            "type": "type_select input:checkbox:checked",
            "period": "period_select input:checkbox:checked"
        };

        $.each(param_types, function(type, param){
            var result = $("#" + param).map(function() {
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

        specific_categories = Filter._get_food_filter_label_text(url);

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

    call_js_bridge: function(params) {

        // get the device type
        var device = $("body").data("device");

        try {
            // check device and handle js bridge accordingly
            if (device == "android") {
                console.log("android");
                // TODO: implement Android js bridge handler
            } else if (device == 'ios') {

                console.log(params);

                webkit.messageHandlers.scoutBridge.postMessage(params)
            }

        } catch(err) {
            // no bridge could be found
            console.log('The native context does not exist yet');
        }

    },

};
