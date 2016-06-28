var Navigation = {

    set_page_tab: function(){

        // get the current location
        var pathname = window.location.pathname;

        if (pathname.indexOf("/food") !== -1) {
            $("#link_food").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_food").attr("aria-selected", "true");
            //Navigation.disable_clicks();
        }
        else if  (pathname.indexOf("/study") !== -1) {
            $("#link_study").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_study").attr("aria-selected", "true");
            $("#link_discover").css("border-bottom", "solid 4px #fff");
        }
        else if (pathname.indexOf("/tech") !== -1) {
           $("#link_tech").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
           $("#link_tech").attr("aria-selected", "true");
           //Navigation.disable_clicks();
       }
        else {
            $("#link_home").attr("aria-selected", "true");
            $("#link_discover").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_discover").attr("aria-selected", "true");
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
