var Filter = {
    get_filter_url: function() {
        var campuses = $("#campus_select").val();
        var payments = $("#payment_select").val();
        var types = $("#type_select").val();
        var foods = $("#food_select").val();
        var cuisines = $("#cuisine_select").val();
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

    init_events: function() {
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