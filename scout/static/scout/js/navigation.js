var Navigation = {

    set_page_tab: function(){

        // get the current location
        var pathname = window.location.pathname;

        if (pathname.indexOf("/discover") >= 0) {
            $("#link_discover").css({"border-bottom":"solid 3px #6564A8", "color":"#6564A8"});
        }
        else if (pathname.indexOf("/filter") >= 0) {
            $("#link_filter").css({"border-bottom":"solid 3px #6564A8", "color":"#6564A8"});
        }
        else if (pathname.indexOf("/detail") >= 0) {
            $("#link_discover").css("border-bottom", "solid 3px #fff");
            $("#link_all").css("border-bottom", "solid 3px #fff");
            $("#link_filter").css("border-bottom", "solid 3px #fff");
        }
        else {
            $("#link_all").css({"border-bottom":"solid 3px #6564A8", "color":"#6564A8"});
        }

    },
};