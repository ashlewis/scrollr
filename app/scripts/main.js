require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        jqueryui: '../components/jquery-ui/ui/jquery.ui.effect',
        baseline: '../components/Baseline.js/jquery.baseline',
        waitForImages: '../components/waitForImages/dist/jquery.waitforimages',
        domReady: '../components/requirejs-domready/domReady',
        throttleDebounce: '../components/jquery-throttle-debounce/jquery.ba-throttle-debounce'
    },
    shim: {
        jqueryui: {
            deps: ['jquery'],
            exports: 'jquery'
        },

        baseline: {
            deps: ['jquery'],
            exports: 'jquery'
        },

        waitForImages: {
            deps: ['jquery'],
            exports: 'jquery'
        },

        throttleDebounce :{
            exports: 'jquery'
        }
    }
});

require(['app'], function (app) {
    'use strict';
    // use app here
     app.init();
    //console.log(app);

});