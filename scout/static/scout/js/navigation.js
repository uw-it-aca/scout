var Navigation = {

    set_page_tab: function(){

        // get the current location
        var pathname = window.location.pathname;

        if (pathname.indexOf("/food") !== -1) {
            $("#link_food").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_food").attr("aria-selected", "true");
            $("#link_food").attr("tabindex", "-1");
            $("#link_food").attr("disabled", "disabled");
            Navigation.disable_clicks();

            $("#link_discover").css("border-bottom", "solid 4px #f1f1f1");
        }
        else if (pathname.indexOf("/map") !== -1) {
            $("#link_food").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_food").attr("aria-selected", "true");
            $("#link_food").attr("tabindex", "-1");
            $("#link_food").attr("disabled", "disabled");
            Navigation.disable_clicks();

            $("#link_discover").css("border-bottom", "solid 4px #f1f1f1");
        }
        else if (pathname.indexOf("/filter") !== -1) {
            $("#link_discover").css("border-bottom", "solid 4px #f1f1f1");
            $("#link_food").css("border-bottom", "solid 4px #f1f1f1");
        }
        else if (pathname.indexOf("/detail") !== -1) {
            $("#link_discover").css("border-bottom", "solid 4px #f1f1f1");
            $("#link_food").css("border-bottom", "solid 4px #f1f1f1");
        }
        else {
            $("#link_discover").css({"border-bottom":"solid 4px #6564A8", "color":"#6564A8"});
            $("#link_discover").attr("aria-selected", "true");
            $("#link_discover").attr("tabindex", "-1");
            $("#link_discover").attr("disabled", "disabled");
            Navigation.disable_clicks();
        }

    },

    disable_clicks: function() {
        $("a[disabled]").click(function(){
            return false;
        });
    }

};
