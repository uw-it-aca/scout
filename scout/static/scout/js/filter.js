var Filter = {
    get_filter_url: function() {
        var campuses = $("#campus_select").val();
        var payments = $("#payment_select").val();
        var foods = $("#food_select").val();
        var cuisine = $("#cuisine_select").val();

    },

    init_events: function() {
        $("#run_search").click(function(){
            var filters = Filter.get_filters();
        });

        $("#filter_toggle").click(function(e) {
            e.preventDefault();
            $("#filter_container").toggle("slow", function() {
                // Animation complete.
            });
        });

    }
};