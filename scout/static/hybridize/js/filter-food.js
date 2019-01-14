var Food_Filter = {
    // class handles filters for food
    // filters are stored under the session variable
    // food_filter_params.

    set_filter_params: function(){
        // similar implementation as the current filter.js for this
        // method. This just specifically gets params set for
        // food filters.html.

        var params = {};
        var param_types = {
            "payment": "payment_select input:checkbox:checked",
            "type": "type_select input:checkbox:checked",
            "food": "food_select input:checkbox:checked",
            "cuisine": "cuisine_select input:checkbox:checked",
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

        // Store these food_filter_params
        sessionStorage.setItem("food_filter_params", JSON.stringify(params));

        // pass the params to native apps via bridge
        Filter.call_js_bridge($.param(params));
    },

    get_filter_url: function(){
        // Again, similar implementation as the current filter.js for
        // this method. Instead of just returning food specific filters,
        // it combines the filter-params filters and study-filter-params.

        var specific_filter = {};
        try {
            specific_filter = JSON.parse(sessionStorage.getItem("food_filter_params"));
            if(specific_filter === undefined || $.isEmptyObject(specific_filter)){
                specific_filter = {};
            }
        } catch(e) {
            console.log(e);
        }
        return specific_filter;
    },

    _get_filter_label_text: function(url){
        // similar implementation as the current filter.js for
        // this method. More food specific.

        var filter_categories = [];
        filter_labels = {
            "payment": "Payment Accepted",
            "type": "Restaurant Type",
            "food": "Food Served",
            "period": "Open Period",
            "open_now": "Open Now",
            "cuisine": "Cuisine"
        };
        $.each(filter_labels, function(filter, label){
            if(url.indexOf("&" + filter) > -1 || url.indexOf("?" + filter) > -1){
                filter_categories.push(label);
            }
        });

        return filter_categories;
    },

};
