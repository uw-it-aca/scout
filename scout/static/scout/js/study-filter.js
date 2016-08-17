var Study_Filter = {
    // class handles filters for study
    // filters are stored under the session variable study-filter-params.

    set_filter_params: function(){
        // similar implementation as the current filter.js for this
        // method. This just specifically gets params set for
        // study filters.html.
    },

    get_filter_url: function(){
        // Again, similar implementation as the current filter.js for
        // this method. Instead of just returning study specific filters,
        // it combines the filter-params filters and study-filter-params.
    },

    _get_filter_label_text: function(){
        // similar implementation as the current filter.js for
        // this method. More study specific.
    },

    reset_filter: function(){
        // just makes a call to generic filter.js reset_filter with
        // the session variable as the parameter.
    },

    init_events: function(){
        // Very similar to the current implementation in fllter.js
        // No tests required for this, I guess?
    },

    populate_filters_from_saved: function(){
        // This method is similar to the current implementation
        // in fllter.js. This method is called by populate_filters_from_saved
        // in filter.js so no tests needed on this.
    },

};

/* node.js exports */
if (typeof exports == "undefined") {
    var exports = {};
}
exports.Study_Filter = Study_Filter;
