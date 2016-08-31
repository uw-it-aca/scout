var Navigation = {

    set_campus_selection: function() {

        $("#campus_select_base").change(function(){
            // get the campus value from select menu
            var url = $(this).val() + Filter.get_current_type();
            var filter = Filter.get_filter_url(url);
            if (filter !== undefined) {
                url = url + "?" + filter;
            }
            window.location= "/" + url;
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
