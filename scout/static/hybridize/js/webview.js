var WebView = {

  render: function(crd) {

    // make sure user coords are passed
    if (crd) {
      console.log("user coords passed to webview");
      //console.log(crd);
    } else {
      console.log("using default coords");
    }

    switch(location.pathname) {
      case "/h/seattle/":
        console.log("render on discover");
        Discover.init_cards(crd);
        break;
      case "/h/seattle/food/":
        console.log("render on food");
        List.init();
        Filter.init();
        Filter.init_events();
        break;
      case "/h/seattle/study/":
        console.log("render on study");
        List.init();
        Filter.init();
        Filter.init_events();
        break;
      case "/h/seattle/tech/":
        console.log("render on tech");
        List.init();
        Filter.init();
        Filter.init_events();
        break;
    }

  },

};
