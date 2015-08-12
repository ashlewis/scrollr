/*global define */
define(['dom', 'utils'], function(Dom, Utils) {

    'use strict';

    var

    // todo: remove inline width and height?

    baseLineImages = function(){

        $(document).waitForImages(

            // all loaded
            function(){

                $('img').baseline(Dom.getLineHeight());

                document.body.scrollTop = Utils.snap(document.querySelector('.target').offsetTop - 3*Dom.getLineHeight(), Dom.getLineHeight());


                Dom.resetViewport();

                
            }/*

             This no longer appears do work?? - so replaced with "$('img').baseline(Dom.getLineHeight());" above

             // each image
             function(){                
                 $(this).baseline(Dom.getLineHeight());

            }*/
        );
    };


    return {
        'baseLineImages' : baseLineImages
    };


});