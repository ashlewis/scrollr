require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        jqueryui: '../components/jquery-ui/ui/jquery.ui.effect',
        baseline: '../components/Baseline.js/baseline',
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
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['candidateNodes','eventHandlers'],
function (CandidateNodes, EventHandlers) {
    'use strict';
    // use app here

    CandidateNodes.init();
    EventHandlers.init();

    //console.log(app);

});