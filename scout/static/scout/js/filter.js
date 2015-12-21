var Filter = {
    get_filter_url: function() {

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
        return $.param(params);
    },

    _get_params_for_select: function(select_results, prefix) {
        params = {};
        if(select_results !== null && select_results.length > 0){
            $.each(select_results, function(idx, result){
                params[prefix + idx] = result;
            });
        }
        return params;

    },

    _get_filter_label_text: function(){
        var filter_categories = [];
        var url = window.location.href;
        var filter_string = "";
        if(url.indexOf("campus") > -1){
            filter_categories.push("Campus");
        }
        if(url.indexOf("payment") > -1){
            filter_categories.push("Payment Accepted");
        }
        if(url.indexOf("type") > -1){
            filter_categories.push("Restaurant Type");
        }
        if(url.indexOf("food") > -1){
            filter_categories.push("Food Served");
        }
        if(url.indexOf("cuisine") > -1){
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

    set_filter_text: function(){
        var filter_text = Filter._get_filter_label_text();
        if(filter_text.length > 0){
            $("#filter_label_text").html(filter_text);
        }

    },

    init_events: function() {
        Filter.set_filter_text();

        $("#run_search").click(function(){
            var filtered_url = Filter.get_filter_url();
            window.location.replace("/?"+filtered_url);
        });

        $("#filter_toggle").click(function(e) {
            e.preventDefault();
            $("#filter_container").toggle("slow", function() {
                // Animation complete.
            });
        });

    }
};
