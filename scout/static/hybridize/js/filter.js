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
            $(this).click(function () {

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
