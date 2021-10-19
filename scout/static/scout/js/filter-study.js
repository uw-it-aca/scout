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
                // First case to handle default selected for capacity. Second case
                // to handle when entire campus is selected in buildings.
                // Instead of manually treating cases, need a better way to handle
                // this.
                if(type == "capacity" && val == "1") {
                    val = null;
                } else if (type == "building" && $("#buildings_toggle input:checked").val() == "entire_campus") {
                    val = null;
                }
                return val;
            }).get();

            params = $.extend(params, Filter._get_params_for_select(result, type));
        });

        // Only populates hours if specify day and time is selected
        if ($("#hours_toggle input:checked").val() == "hours_list") {
            // gets the parameter for start and stop hours
            params = $.extend(params, Study_Filter.get_processed_hours());
        }

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

        $("#hours_toggle input").click(function(){
            if ($(this).val() == "hours_list") {
                $("#hours_list").removeClass("visually-hidden");
            } else {
                $("#hours_list").addClass("visually-hidden");
            }
        });

        $("#buildings_toggle input").click(function() {
            if ($(this).val() == "building_list") {
                $("#building_select").removeClass("visually-hidden");
            } else {
                $("#building_select").addClass("visually-hidden");
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

        // calculates and stores open_at
        var day = $("#day-from option:selected").val();
        var hours = $("#hour-from option:selected").val();
        var period = $("#ampm-from option:selected").val();
        params["open_at"] = Study_Filter.process_hours_into_server_hours(day, hours, period);

        // calculates and stores open_until
        var day = $("#day-until option:selected").val();
        var hours = $("#hour-until option:selected").val();
        var period = $("#ampm-until option:selected").val();
        params["open_until"] = Study_Filter.process_hours_into_server_hours(day, hours, period);

        // checks if start and stop are not the same.
        if (params["open_at"] == params["open_until"]) {
            params = {};
        }

        return params;
    },

    process_hours_into_server_hours: function(day, hours, period){
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
        result += hours;
        return result;
    },

    populate_hour_filters: function() {
        var params = JSON.parse(sessionStorage.getItem("study_filter_params"));
        if(params == undefined){
            return;
        }

        // check if open_at and open_until exist
        if (params["open_at"] !== undefined && params["open_until"] !== undefined) {
            var result = [];

            // populate hour from filters
            result = Study_Filter.process_hours_from_server_hours(params["open_at"]);
            $("#day-from").val(result[0]);
            $("#hour-from").val(result[1]);
            $("#ampm-from").val(result[2]);

            // populate hour until filters
            result = Study_Filter.process_hours_from_server_hours(params["open_until"]);
            $("#day-until").val(result[0]);
            $("#hour-until").val(result[1]);
            $("#ampm-until").val(result[2]);

            // Find a better way of selecting input and displaying the hours_list
            $("#hours_toggle").find("input[value=hours_list]").prop("checked", true);
            $("#hours_list").removeClass("visually-hidden");

        }
    },

    // method takes in one parameter, the server_hours and returns a list with day,
    // hour and period in order
    process_hours_from_server_hours: function(server_hours) {
        var result = [];
        server_hours = server_hours.split(",");

        var day = "";
        var hours = "";
        // default value to prevent adding this case.
        var period = "AM";

        // add the day to the list
        day = server_hours[0];
        result.push(day);

        // add the hours to the list
        hours = server_hours[1].split(":");
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
