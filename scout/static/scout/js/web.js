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
        
        // handle map link
        mapSwitcher();
        
        // load google map
        initializeMap();
                                
    });
        
    $('#pjax-container').on('pjax:timeout', function(event) {
        // Prevent default timeout redirection behavior
        event.preventDefault();
    });

    // handle back and forward buttons
    $('#pjax-container').on('pjax:popstate', function(event) {
                        
        $(document).one('pjax:end', function(event) {
        
            // load google map
            initializeMap();
        });            
    });

    // manual pjax via click event
    
    $('#map_link').click(function() {
        
        //alert( "Handler for .click() called." );
        var $url = $cur.find("a").attr("href");
        $.pjax({url: $url, container: '#pjax-container'});
    
    });
    
}); 

// ### GLOBAL LOAD EVENT (pjax fallback) ###############
$(window).load(mapSwitcher);

function mapSwitcher(jQuery) {
    
    // ROUTING FOR PJAX
    pathname = window.location.pathname;
        
    if (pathname.indexOf("/detail/56874") >= 0) {
       $('#list_map_switcher').hide();
    }
    else if (pathname.indexOf("/list/") >= 0) {
       $('#list_map_switcher').show();
    }
    else if (pathname.indexOf("/favorites/") >= 0) {
       $('#list_map_switcher').show();
    }
    else {
        $('#list_map_switcher').hide();
    }
}