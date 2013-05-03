require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        jqueryui: '../components/jquery-ui/ui/jquery.ui.effect',
        baseline: '../components/Baseline.js/jquery.baseline',
        waitForImages: '../components/waitForImages/dist/jquery.waitforimages'
    },
    shim: {
        baseline: {
            deps: ['jquery'],
            exports: 'jquery'
        },

        waitForImages: {
            deps: ['jquery'],
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