var WebView = {

  render: function() {

    switch(location.pathname) {
      case "/h/seattle/":
        console.log("render on discover");
        Discover.init_cards();
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
