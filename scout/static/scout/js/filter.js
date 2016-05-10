var Filter = {
    /* Iterates through filter checkboxes to initialize filter parameters,
       and store it in a session variable. */
    set_filter_params: function() {

        // Each of these forms an array of checked filters in each category
        var campuses = $("#campus_select input:checkbox:checked").map(function() {
            return $(this).val();
        }).get();

        var payments = $("#payment_select input:checkbox:checked").map(function() {
            return $(this).val();
        }).get();

        var types = $("#type_select input:checkbox:checked").map(function() {
            return $(this).val();
        }).get();

        var foods = $("#food_select input:checkbox:checked").map(function() {
            return $(this).val();
        }).get();

        var cuisines = $("#cuisine_select input:checkbox:checked").map(function() {
            return $(this).val();
        }).get();

        var periods = $("#period_select input:checkbox:checked").map(function() {
            return $(this).val();
        }).get();

        // For each filter category, form objects using _get_params_for_select
        // and add them to params.
        var params = {};

        params = $.extend(params, Filter._get_params_for_select(campuses,
                                                                "campus"));
        params = $.extend(params, Filter._get_params_for_select(payments,
                                                                "payment"));
        params = $.extend(params, Filter._get_params_for_select(types,
                                                                "type"));
        params = $.extend(params, Filter._get_params_for_select(foods,
                                                                "food"));
        params = $.extend(params, Filter._get_params_for_select(cuisines,
                                                                "cuisine"));
        params = $.extend(params, Filter._get_params_for_select(periods,
                                                                "period"));
        if($("#open_now input").is(":checked")){
            params = $.extend(params, {"open_now": true});
        }
        // Store these
        sessionStorage.setItem("filter_params", JSON.stringify(params));

    },

    // Look at session variable and return its corresponding URL String
    // If the session variable doesn't exist, return undefined.
    get_filter_url: function() {
        if(sessionStorage.getItem("filter_params") !== null){
            var params = JSON.parse(sessionStorage.getItem("filter_params"));
            return $.param(params);
        }
        return undefined;
    },

    // Return object where keys of the form prefixN are mapped to
    // values in select_results. e.g. 
    _get_params_for_select: function(select_results, prefix) {
        params = {};
        if(select_results !== null && select_results.length > 0){
            $.each(select_results, function(idx, result){
                params[prefix + idx] = result;
            });
        }
        return params;

    },

    // Parse the current URL to get the human-readable "Filtering By" text
    _get_filter_label_text: function(){
        var filter_categories = [];
        var url = window.location.href;
        var filter_string = "";
        if(url.indexOf("&campus") > -1 || url.indexOf("?campus") > -1){
            filter_categories.push("Campus");
        }
        if(url.indexOf("&payment") > -1 || url.indexOf("?payment") > -1){
            filter_categories.push("Payment Accepted");
        }
        if(url.indexOf("&type") > -1 || url.indexOf("?type") > -1){
            filter_categories.push("Restaurant Type");
        }
        if(url.indexOf("&food") > -1 || url.indexOf("?food") > -1){
            filter_categories.push("Food Served");
        }
        if(url.indexOf("&period") > -1 || url.indexOf("?period") > -1){
            filter_categories.push("Open Period");
        }
        if(url.indexOf("&open_now") > -1 || url.indexOf("?open_now") > -1){
            filter_categories.push("Open Now");
        }
        if(url.indexOf("&cuisine") > -1 || url.indexOf("?cuisine") > -1){
            filter_categories.push("Cuisine");
        }
        for(var i = 0; i < filter_categories.length; i++){
            filter_string += filter_categories[i];
            if (i < filter_categories.length - 1){
                filter_string += ", ";
            }
        }
        return filter_string;
    },

    // Get friendly text from _get_filter_label_text, and if not empty,
    // set the actual text on the page to that. 
    set_filter_text: function(){
        var filter_text = Filter._get_filter_label_text();
        if(filter_text.length > 0){
            $("#filter_label_text").html(filter_text);
        }
    },

    // Clear session variable, uncheck checkboxes, and reset address bar URL
    reset_filter: function() {
        sessionStorage.removeItem("filter_params");
        $("input:checkbox").attr('checked', false);
        Filter.replace_food_href();
        window.location.replace("/food/");
    },
    
    // Set the potential events that can occur if buttons/links are clicked
    init_events: function() {
        Filter.set_filter_text();

        $("#run_search").click(function(){
            Filter.set_filter_params();
            var filtered_url = Filter.get_filter_url();
            if (filtered_url !== undefined){
                window.location.replace("/food/?"+filtered_url);
            }
        });

        $("#reset_filter, #reset_button").click(function() {
            Filter.reset_filter();
            console.log("reset hit");
        });
    },
    
    // Checks off boxes based on the filter_params
    init: function() {
        Filter.populate_filters_from_saved();
    },

    // Checks off boxes based on the filter_params, if empty does nothing
    populate_filters_from_saved: function() {
        var filter_item;
        // do nothing if no filters are saved
        if(sessionStorage.getItem("filter_params") === null){
            return;
        }
        
        var params = JSON.parse(sessionStorage.getItem("filter_params"));
        $.each(params, function(idx, val){
            if(idx.indexOf("campus") > -1){
                filter_item = $("#campus_select").find("input[value='" + val + "']");
                $(filter_item[0]).prop("checked", true);
            }
            if(idx.indexOf("period") > -1){
                filter_item = $("#period_select").find("input[value='" + val + "']");
                $(filter_item[0]).prop("checked", true);
            }
            if(idx.indexOf("open_now") > -1){
                filter_item = $("#open_now").find("input[value='open_now']");
                $(filter_item[0]).prop("checked", true);
            }
            if(idx.indexOf("type") > -1){
                filter_item = $("#type_select").find("input[value='" + val + "']");
                $(filter_item[0]).prop("checked", true);
            }
            if(idx.indexOf("payment") > -1){
                filter_item = $("#payment_select").find("input[value='" + val + "']");
                $(filter_item[0]).prop("checked", true);
            }
            if(idx.indexOf("cuisine") > -1){
                filter_item = $("#cuisine_select").find("input[value='" + val + "']");
                $(filter_item[0]).prop("checked", true);
            }
            if(idx.indexOf("food") > -1){
                filter_item = $("#food_select").find("input[value='" + val + "']");
                $(filter_item[0]).prop("checked", true);
            }
        });
    },

    // Connects the food_anchor/link_food button to the URL based on the 
    // filters selected
    replace_food_href: function(){
        var filter_url = Filter.get_filter_url();
        var food_anchor = $("#link_food");
        var food_url;
        if (filter_url !== undefined){
            food_url = "/food/?" + filter_url;
        } else {
            food_url = "/food/";
        }
        if(food_anchor !== undefined){
                $(food_anchor).attr('href', food_url);
        }
    }
};

/* node.js exports */
if (typeof exports == "undefined") {
    var exports = {};
}
exports.Filter = Filter;
