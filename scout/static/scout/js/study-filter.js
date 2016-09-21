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
            "lighting": "lighting_select input:checkbox:checked",
            "reservation": "reserve_select input:checkbox:checked",
            "capacity": "capacity_select option:selected"
        };

        $.each(param_types, function(type, param){
            var result = $("#" + param).map(function() {
                var val = $(this).val();
                // case to handle default none selected!
                if(type == "capacity" && val == "0") {
                    val = null;
                }
                return val;
            }).get();

            params = $.extend(params, Filter._get_params_for_select(result, type));
        });
        // gets the parameter for start and stop hours
        params = $.extend(params, Study_Filter.get_processed_hours());

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
            "resources": "Resources",
            "reservation": "Reservability",
            "capacity": "Capacity",
            "fuzzy_hours": "Hours"
        };
        $.each(filter_labels, function(filter, label){
            if(url.indexOf(filter) > -1){
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

        $("input[name$='optionsHours']").click(function() {
            if ($(this).val() == "hours_list") {
                $("#hours_list").show();
            }
            else {
                $("#hours_list").hide();
            }
        });

        $("input[name$='optionsLocations']").click(function() {
            if ($(this).val() == "building_list") {
                $("#building_select").show();
            }
            else {
                $("#building_select").hide();
            }
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
            "lighting": "lighting_select",
            "reservation": "reserve_select",
            "capacity": "capacity_select"
        };
        Filter.populate_filters_from_saved("study_filter_params", param_types);
    },

    get_processed_hours: function(){
        var params = {};

        // calculates and stores fuzzy_hours_start
        var day = $("#day-from option:selected").val();
        var hours = $("#hour-from option:selected").val();
        var period = $("#ampm-from option:selected").val();
        params["fuzzy_hours_start"] = Study_Filter.process_hours_into_fuzzy(day, hours, period);

        // calculates and stores fuzzy_hours_end
        var day = $("#day-until option:selected").val();
        var hours = $("#hour-until option:selected").val();
        var period = $("#ampm-until option:selected").val();
        params["fuzzy_hours_end"] = Study_Filter.process_hours_into_fuzzy(day, hours, period);

        // checks if start and stop are not the same.
        if (params["fuzzy_hours_start"] == params["fuzzy_hours_end"]) {
            params = {};
        }

        return params;
    },

    process_hours_into_fuzzy: function(day, hours, period){
        var result = day + ",";
        if (period == "AM") {
            if(hours.indexOf("12:") > -1) {
                hours = hours.replace(/12/, "00");
            }
        } else if (period == "PM") {
            if(!(hours.indexOf("12:") > -1)) {
                var tempHour = hours.split(":");
                hours = (parseInt(tempHour[0]) + 12) + ":" + tempHour[1];
            }
        }
        result += hours + ":00";
        return result;
    },

    populate_hour_filters: function() {
        var params = JSON.parse(sessionStorage.getItem("study_filter_params"));
        if(params == undefined){
            return;
        }

        // check if fuzzy_hours_start and fuzzy_hours_end exist
        if (params["fuzzy_hours_start"] !== undefined && params["fuzzy_hours_end"] !== undefined) {
            var result = [];

            // populate hour from filters
            result = Study_Filter.process_hours_from_fuzzy(params["fuzzy_hours_start"]);
            $("#day-from").val(result[0]);
            $("#hour-from").val(result[1]);
            $("#ampm-from").val(result[2]);

            // populate hour until filters
            result = Study_Filter.process_hours_from_fuzzy(params["fuzzy_hours_end"]);
            $("#day-until").val(result[0]);
            $("#hour-until").val(result[1]);
            $("#ampm-until").val(result[2]);
        }
    },

    // method takes in one parameter, the fuzzy hours and returns a list with day,
    // hour and period in order
    process_hours_from_fuzzy: function(fuzzy) {
        var result = [];
        fuzzy = fuzzy.split(",");

        var day = "";
        var hours = "";
        // default value to prevent adding this case.
        var period = "AM";

        // add the day to the list
        day = fuzzy[0];
        result.push(day);

        // add the hours to the list
        hours = fuzzy[1].split(":");
        hours[0] = parseInt(hours[0]);
        if (hours[0] >= 12) {
            period = "PM";
            hours[0] = hours[0] - 12;
        }
        hours[0] = hours[0] == 0 ? 12 : hours[0];
        hours[0] = hours[0] > 9 ? "" + hours[0] : "0" + hours[0];
        hours = hours[0] + ":" + hours[1];
        result.push(hours);

        // add period to list
        result.push(period);

        return result;
    },

};

/* node.js exports */
if (typeof exports == "undefined") {
    var exports = {};
}
exports.Study_Filter = Study_Filter;
