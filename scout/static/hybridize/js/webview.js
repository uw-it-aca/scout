var WebView = {

  render: function(hlat, hlng) {

    // make sure user coords are passed
    if (hlat && hlng) {
      console.log("user coords passed to webview");
      //console.log(crd);
    } else {
      console.log("using default coords");
    }

    // initialize webview of main landing pages
    let foodRe = new RegExp('\/h\/[a-z]+\/food\/');
    let studyRe = new RegExp('\/h\/[a-z]+\/study\/');
    let techRe = new RegExp('\/h\/[a-z]+\/tech\/');
    let discoverRe = new RegExp('\/h\/[a-z]+\/');

    switch(true) {
      case foodRe.test(location.pathname):
        console.log('render on food');
        List.init();
        Filter.init();
        Filter.init_events();
        break;
      case studyRe.test(location.pathname):
        console.log('render on study');
        List.init();
        Filter.init();
        Filter.init_events();
        break;
      case techRe.test(location.pathname):
        console.log('render on tech');
        List.init();
        Filter.init();
        Filter.init_events();
        break;
      case discoverRe.test(location.pathname):
        console.log('render on discover');
        Discover.init_cards(hlat, hlng);
        break;
    }

  },

  initialize: function() {

    console.log("initialize webview")
    var blah = "hello world"
    $("#geodemo").html("Send hello world");

    // get the device type
    var device = $("body").data("device");

    try {
        // check device and handle js bridge accordingly
        if (device == "android") {
            scoutBridge.setParams(blah);
        } else if (device == 'ios') {
            webkit.messageHandlers.scoutBridge.postMessage(blah);
        }

    } catch(err) {
        // no bridge could be found
        console.log('The native context does not exist yet.');
    }


  },

};
