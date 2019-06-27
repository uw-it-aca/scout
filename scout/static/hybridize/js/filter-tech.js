var Tech_Filter = {
    // class handles filters for tech
    // filters are stored under the session variable
    // tech_filter_params.

    set_filter_params: function(){
        // similar implementation as the current filter.js for this
        // method. This just specifically gets params set for
        // tech filters.html.

        var params = {};
        var param_types = {
            "brand": "brand_select input:checkbox:checked",
            "subcategory": "subcategory_select input:checkbox:checked",
        };

        $.each(param_types, function(type, param){
            var result = $("#" + param).map(function() {
                return $(this).val();
            }).get();
            params = $.extend(params, Filter._get_params_for_select(result, type));
        });

        // Store these tech_filter_params
        sessionStorage.setItem("tech_filter_params", JSON.stringify(params));

        // pass the params to native apps via bridge
        Filter.call_js_bridge($.param(params));

    },

    get_filter_url: function(){
        // Again, similar implementation as the current filter.js for
        // this method. Instead of just returning tech specific filters,
        // it combines the filter-params filters and tech-filter-params.

        var specific_filter = {};
        try {
            specific_filter = JSON.parse(sessionStorage.getItem("tech_filter_params"));
            if(specific_filter === undefined || $.isEmptyObject(specific_filter)){
                specific_filter = {};
            }
        } catch(e) {
            //console.log(e);
        }
        return specific_filter;
    },

    _get_filter_label_text: function(url){
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

};
