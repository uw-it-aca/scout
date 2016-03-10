var Gallery = {

    init_gallery: function(){

        // handle gallery images
        $('#imageContainer img').each(function (index) {
            if ($(this).attr('onclick') !== undefined) {
                if ($(this).attr('onclick').indexOf("runThis()") == -1) {
                    $(this).click(function () {
                        $(this).attr('onclick');
                        var src = $(this).attr("src");
                        Gallery.show_large_image(src);
                    });
                }
            }
            else {
                $(this).click(function () {
                    var src = $(this).attr("src");
                    Gallery.show_large_image(src);
                });
            }
        });

        $('body').on('click', '.modal-overlay', function () {
            $('.modal-overlay, .modal-img').remove();
            $('body').removeClass("freeze");
        });

    },

    show_large_image: function(imagePath) {

        var isMobile = $("body").data("mobile");
        var imageWidth;

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

};
