$(document).on('ready', function(event) {
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
    // call this last so all page level location event listiners have been declared
    Geolocation.update_location();

    Layout.init_layout();

    Filter.init_events();

    Navigation.set_page_tab();



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
        $('body').addClass("freeze");

        $('body').append('<div class="modal-overlay"><div class="modal-img"><img src="' + imagePath.replace("small","large") + '" /></div></div>');
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
