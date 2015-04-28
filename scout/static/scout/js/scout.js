var pathname;

// document.ready shorthand
$(function() {
    
    // identify what type of hyperlinks are pjax-able
    $(document).pjax('a[data-pjax]', '#pjax-container',  {timeout: 10000})
     
    $('#pjax-container').on("pjax:send", function(e) {
        
        // if PJAX is taking longer than 250ms... show the loading message & hide existing content
        loadingTimeout = setTimeout(function() {
            $("#pjax-loading").show();
            $('#pjax-container').hide();
        }, 250);
                  
    });

    $('#pjax-container').on("pjax:complete", function() {
                
        // once pjax completes... hide the loading message and make sure the content is showing    
        $("#pjax-loading").hide();
        $('#pjax-container').show();
        
        // cancel showing the message when the ajax call completes.
        clearTimeout(loadingTimeout);
        
       
        
        // handle url routes
        handleRoutes();
        
         // load google map
        initialize();
                        
    });
        
    $('#pjax-container').on('pjax:timeout', function(event) {
        // Prevent default timeout redirection behavior
        event.preventDefault();
    });
    
    $('#pjax-container').on('pjax:end', function(event) {
        
        
    });
    
    
    // manual pjax via click event
    
    $('#list_link').click(function() {
        
        //alert( "Handler for .click() called." );
        var $url = $cur.find("a").attr("href");
        $.pjax({url: $url, container: '#pjax-container'});
    
    });
    
}); 


function handleRoutes(jQuery) {
    
    // ROUTING FOR PJAX
    pathname = window.location.pathname;
        
    // if on "badges" page
    if(pathname.indexOf("/detail") >= 0) {
       console.log("loaded detail");
       $('#list_map_switcher').hide();
    }
    else if (pathname.indexOf("/filters") >= 0) {
       console.log("loaded filters");
       $('#list_map_switcher').hide();
    }
    else {
        $('#list_map_switcher').show();
    }
}

