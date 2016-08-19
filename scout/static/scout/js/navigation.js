var Navigation = {

    set_campus_selection: function() {

        $("#campus_select_base").change(function(){

            var url = $(this).val();
            if (url) {
                window.location = "/" + url; // redirect
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
