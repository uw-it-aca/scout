$(document).on('ready', function(event) {

    var isMobile = $("body").data("mobile");

    Layout.init_layout();
    Navigation.set_page_tab();

    // page based JS calls
    var page_path = window.location.pathname;
    if (page_path.indexOf("food") !== -1) {
        List.init();
        Map.init_map();
    } else if (page_path.indexOf("detail") !== -1) {
        Map.init_map();

    } else if (page_path.indexOf("filter") !== -1) {
        Filter.init();
    } else if (page_path.indexOf("map") !== -1){
        // Mobile map page
        Map.init_map_page();
        List.init();
        Map.init_map();
    } else {
        Discover.init_cards();
    }
    Filter.replace_food_href();

    // call this last so all page level location event listeners have been declared
    Geolocation.update_location();

    Filter.init_events();

    // handle gallery images
    $('#imageContainer img').each(function (index) {
        if ($(this).attr('onclick') !== undefined) {
            if ($(this).attr('onclick').indexOf("runThis()") == -1) {
                $(this).click(function () {
                    $(this).attr('onclick');
                    var src = $(this).attr("src");
                    ShowLargeImage(src);
                });
            }
        }
        else {
            $(this).click(function () {
                var src = $(this).attr("src");
                ShowLargeImage(src);
            });
        }
    });

    $('body').on('click', '.modal-overlay', function () {
        $('.modal-overlay, .modal-img').remove();
        $('body').removeClass("freeze");
    });

    function ShowLargeImage(imagePath) {

        var imageWidth;

        console.log( $(".scout-secondary"));

        // if mobile... else desktop
        if (isMobile !== undefined ) {
             imageWidth = $(window).outerWidth();
         }
         else {
             imageWidth = '900';
         }

        var leftMargin = imageWidth / 2;

        $('body').addClass("freeze");
        $('body').append('<div class="modal-overlay"><div class="loader" style="position:absolute; top: 50%; left: 50%; margin-left:-13px; margin-top: -13px;">Loading...</div><div class="modal-img" style="margin-left:-'+ leftMargin +'px;"><img src="' + imagePath.replace("200",imageWidth) + '" style="width:'+ imageWidth +'px;" /></div></div>');
    }

});

// scrollTo function

$.fn.scrollTo = function(target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) {
        callback = options;
        options = target;
    }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 140,
        duration: 400,
        //easing: 'swing'
    }, options);

    return this.each(function() {
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({
            scrollTop: scrollY
        }, parseInt(settings.duration), settings.easing, function() {
            if (typeof callback == 'function') {
                callback.call(this);
            }
        });
    });
};
