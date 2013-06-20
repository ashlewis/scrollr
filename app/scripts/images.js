/*global define */
define(['dom', 'utils'], function(Dom, Utils) {

    'use strict';

    var

    baseLineImages = function(){

        $(document).waitForImages(

            // all loaded
            function(){
                document.body.scrollTop = Utils.snap(document.querySelector('.target').offsetTop - 3*Dom.getLineHeight(), Dom.getLineHeight());

                Dom.resetViewport();
            },

            // each image
            function () {

                $(this).baseline(Dom.getLineHeight());

            }
        );
    };


    return {
        'baseLineImages' : baseLineImages
    };


});