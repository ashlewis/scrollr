/*global define */
define(['utils', 'dom'], function (Utils, Dom) {

    'use strict';

    var

    originalScrollTop,

    setOriginalScrollTop = function(value){
        originalScrollTop = value;
    },

    /**
    *
    */
    toggleNativeStyleSheets = function(toggle){
        for (var i = document.styleSheets.length; i--;) {
            if (document.styleSheets[i].media.mediaText != 'screen, scrollr') {
                document.styleSheets[i].disabled = toggle;
            }
        }
    },

    hideOriginalContent = function(){

        [].forEach.call(document.body.children, function(node){

            Utils.addClass(node, 'hidden');
        });
    },

    showOriginalContent = function(){

        [].forEach.call(document.body.children, function(node){
            Utils.removeClass(node, 'hidden');
        });
    },

    reset = function(){

          document.body.removeChild(Dom.getPage());
          showOriginalContent();
          document.body.scrollTop = originalScrollTop;

      };



    return {
        'toggleNativeStyleSheets' : toggleNativeStyleSheets,
        'hideOriginalContent' : hideOriginalContent,
        'showOriginalContent' : showOriginalContent,
        'reset' : reset,
        'setOriginalScrollTop': setOriginalScrollTop
    };


});