var Navigation = {

    set_campus_selection: function() {

        $("#campus_select_base").change(function(){
            // get the campus value from select menu
            var new_campus = $(this).val();
            var type = Filter.get_current_type();
            sessionStorage.removeItem("study_filter_params");
            sessionStorage.removeItem("food_filter_params");
            sessionStorage.removeItem("tech_filter_params");
            Navigation.swap_campus_urls(new_campus);
            window.location= "/" + new_campus + type;
        });
    },

    swap_campus_urls: function (new_campus) {
        // Handles case where user impatiently clicks links while waiting for
        // new campus page to load. SCOUT-340
        var anchor_ids_to_swap = ['link_home', 'link_food', 'link_study', 'link_tech'];

        $(anchor_ids_to_swap).each(function (idx, val){
            var anchor = $("#" + val);
            var url = $(anchor).attr('href');
            if (url !== undefined){
                var new_url = url.replace(/seattle|tacoma|bothell/, new_campus);
                $(anchor).attr('href', new_url);
            }
        });
    },


    get_campus_selection: function () {
        var campus = $("#campus_select_base").val();
        return campus;
    },

    disable_clicks: function() {
        $("a[disabled]").click(function(){
            return false;
        });
    }

};

/* node.js exports */
if (typeof exports == "undefined") {
    var exports = {};
}
exports.Navigation = Navigation;
