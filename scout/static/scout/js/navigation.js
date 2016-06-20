var Navigation = {

    set_page_tab: function(){

        // get the current location
        var pathname = window.location.pathname;

        if (pathname.indexOf("/food") !== -1) {
            $("#link_food").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_food").attr("aria-selected", "true");
            // $("#link_food").attr("tabindex", "-1");
            // $("#link_food").attr("disabled", "disabled");
            Navigation.disable_clicks();
        }
        else if  (pathname.indexOf("/study") !== -1) {
            $("#link_study").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_study").attr("aria-selected", "true");
            // $("#link_study").attr("tabindex", "-1");
            // $("#link_study").attr("disabled", "disabled");
            Navigation.disable_clicks();
        }
        else if (pathname.indexOf("/tech") !== -1) {
           $("#link_tech").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
           $("#link_tech").attr("aria-selected", "true");
           // $("#link_tech").attr("tabindex", "-1");
           // $("#link_tech").attr("disabled", "disabled");
           Navigation.disable_clicks();
       }
        else if (pathname.indexOf("/detail") !== -1) {
            $("#link_food").css("border-bottom", "solid 4px #fff");
            $("#link_study").css("border-bottom", "solid 4px #fff");
            $("#link_tech").css("border-bottom", "solid 4px #fff");
        }

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
