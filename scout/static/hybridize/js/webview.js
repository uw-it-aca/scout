var WebView = {

  render: function(crd) {

    // make sure user coords are passed
    if (crd) {
      console.log("user coords passed to webview");
      //console.log(crd);
    } else {
      console.log("using default coords");
    }

    // initialize webview by requesting html5 geolocation
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
        Discover.init_cards(crd);
        break;
    }

  },

};
