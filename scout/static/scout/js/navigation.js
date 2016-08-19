var Navigation = {

    set_campus_selection: function() {

        // page based JS calls
        var page_path = window.location.pathname;

        $("#campus_select_base").change(function(){

            // get the campus value from select menu
            var url = $(this).val();

            // add corresponding tab if not on discover
            if (page_path.indexOf("food") !== -1) {
                url = url + "/food";
            }
            else if (page_path.indexOf("study") !== -1){
                url = url + "/study";
            }
            else if (page_path.indexOf("tech") !== -1){
                url = url + "/tech";
            }

            if (url) {
                // redirect to correct page
                window.location = "/" + url;
            }
            return false;

        });
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
