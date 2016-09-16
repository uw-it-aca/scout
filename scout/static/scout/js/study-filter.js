var Study_Filter = {
    // class handles filters for study
    // filters are stored under the session variable
    // study_filter_params.

    set_filter_params: function(){
        // similar implementation as the current filter.js for this
        // method. This just specifically gets params set for
        // study filters.html.

        var params = {};
        var param_types = {
            "building": "building_select option:selected",
            "resources": "resources_select input:checkbox:checked",
            "type": "type_select input:checkbox:checked",
            "noise": "noise_select input:checkbox:checked",
            "food": "food_select input:checkbox:checked",
            "lighting": "lighting_select input:checkbox:checked"
        };

        $.each(param_types, function(type, param){
            var result = $("#" + param).map(function() {
                return $(this).val();
            }).get();
            params = $.extend(params, Filter._get_params_for_select(result, type));
        });

        // Store these study_filter_params
        sessionStorage.setItem("study_filter_params", JSON.stringify(params));
    },

    get_filter_url: function(){
        // Again, similar implementation as the current filter.js for
        // this method. Instead of just returning study specific filters,
        // it combines the filter-params filters and study-filter-params.

        var specific_filter = {};
        try {
            specific_filter = JSON.parse(sessionStorage.getItem("study_filter_params"));
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
        // this method. More study specific.

        var filter_categories = [];
        filter_labels = {
            "building": "Building",
            "type": "Study Type",
            "food": "Refreshments",
            "lighting": "Lighting",
            "noise": "Noise Level",
            "resources": "Resources"
        };
        $.each(filter_labels, function(filter, label){
            if(url.indexOf("&" + filter) > -1 || url.indexOf("?" + filter) > -1){
                filter_categories.push(label);
            }
        });
        return filter_categories;
    },

    reset_filter: function(){
        // just makes a call to generic filter.js reset_filter with
        // the session variable as the parameter.
        Filter.reset_filter("study_filter_params", "/study/");
    },

    init_events: function(){
        // Very similar to the current implementation in fllter.js
        // No tests required for this, I guess?

        $("#run_study_search").click(function(){
            Study_Filter.set_filter_params();
            Filter.redirect_to_page("/study/");
        });

        $("#reset_study_button").click(function() {
            Study_Filter.reset_filter();
        });

        $("#reset_study_list").click(function() {
            Study_Filter.reset_filter();
        });
    },

    populate_filters_from_saved: function(){
        // This method is similar to the current implementation
        // in fllter.js. This method is called by populate_filters_from_saved
        // in filter.js so no tests needed on this.

        var param_types = {
            "building": "building_select",
            "resources": "resources_select",
            "type": "type_select",
            "noise": "noise_select",
            "food": "food_select",
            "lighting": "lighting_select"
        };
        Filter.populate_filters_from_saved("study_filter_params", param_types);
    },

};

/* node.js exports */
if (typeof exports == "undefined") {
    var exports = {};
}
exports.Study_Filter = Study_Filter;
