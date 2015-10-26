document.addEventListener('WebViewJavascriptBridgeReady', function(event) {
    
    // initialize bridge
    var bridge = event.bridge
    bridge.init()

    // Start using the bridge by registering events
    
    // register handler for receiving data from device
    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
	
		alert(data + ":fire button clicked from native bridge");

		// handle the filter options on the page and go to the filtered url
		window.location.href='/?hybrid=true&x_pop_page_and_replace=true&x_page_title=Filtered+Title&x_right_button=filter_button&x_left_button=discover_button';
	})
	
	// send this to the device
	var blah = "send this to the device from javascript";
	
	// call a handler for sending data to device
	bridge.callHandler('testObjcCallback', blah, function(response) {
	 	log('JS got response', response)
	})
    
        
}, false)


// jquery ready
	
$( document ).ready(function() {
	
	// handle resetting the filters
	$('#reset_filter').click(function() {
					
		// return to list view and default state
		window.location.href='/?hybrid=true&x_pop_page_and_replace=true&x_page_title=Food+Nearby&x_right_button=filter_button&x_left_button=discover_button'
	});

});