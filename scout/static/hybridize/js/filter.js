Filter = {

    init_filter: function () {

        var query;

        // handle native submit click from native
        $("#filter_submit").click(function(e) {
            // 1. process the web form and generate the query param
            // 2. call the native app and pose the query param as a "message"
            query = "?period0=late_night"
            Filter.call_js_bridge(query);
        });

        // reset form
        $('#filter_clear').click(function(e) {
            $('#scout_filter').trigger("reset");
            $('#scout_filter input:checkbox').removeAttr('checked');
            $('#scout_filter input:radio').removeAttr('checked');

            // TODO: make sure query param is cleared out before
            query = ""
            Filter.call_js_bridge(query);

        });

        $('#scout_filter li').each(function(e) {
            $(this).click(function () {

                // TODO: process the input and rebuild the query param
                query = "?period0=late_night"
                Filter.call_js_bridge(query);

            })
        });

    },

    call_js_bridge: function(query) {

        // get the device type
        var device = $("body").data("device");

        try {
            // check device and handle js bridge accordingly
            if (device == "android") {
                console.log("android");
                // TODO: implement Android js bridge handler
            } else if (device == 'ios') {
                console.log("ios");
                webkit.messageHandlers.scoutBridge.postMessage(query)
            }

        } catch(err) {
            // no bridge could be found
            console.log('The native context does not exist yet');
        }

    },

};
