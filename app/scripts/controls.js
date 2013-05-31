/*global define */
define([], function () {

    'use strict';

    var

      CONTROLS = {
        getUpButton : false,
        getDownButton : false,
        getStepUpButton : false,
        getStepDownButton : false,
        getCloseButton : false
      },

     /**
      *
      */
      createButton = function(type, clickHandler, args){
        var link = document.createElement('a'),
            icon = document.createElement('i');

        link.className = 'button '+ type;
        icon.className = 'icon-'+ type;
        icon.unselectable = "on";

        link.appendChild(icon);
        link.addEventListener(
            'click',
            function(){
                clickHandler(args);
            },
            false
        );


        return link;
      },

      /**
      *
      */
      createViewportResizer = function(position){

        var viewportResizer = document.createElement('div'),
            text = document.createTextNode('....');

        viewportResizer.className = 'viewport-resizer viewport-resizer-'+ position;

        viewportResizer.appendChild(text);

        return viewportResizer;
      },

      /**
      *
      */
      getUpButton = function(){

        if (CONTROLS.upButton) {
          return CONTROLS.upButton;
        }

        return createButton('arrow-up', scrollUp);
      },

       /**
      *
      */
      getDownButton = function(){

        if (CONTROLS.downButton) {
          return CONTROLS.downButton;
        }

        return createButton('arrow-down', scrollDown);
      },

       /**
      *
      */
      getStepUpButton = function(){

        if (CONTROLS.stepUpButton) {
          return CONTROLS.stepUpButton;
        }

        return createButton('arrow-up step-up', scrollUp, getLineHeight());
      },

       /**
      *
      */
      getStepDownButton = function(){

        if (CONTROLS.stepDownButton) {
          return CONTROLS.stepDownButton;
        }

        return createButton('arrow-down step-down', scrollDown, getLineHeight());
      },

      /**
      *
      */
      getCloseButton = function(){

        if (CONTROLS.closeButton) {
          return CONTROLS.closeButton;
        }

        return createButton('remove', readingModeOff);
      };


    return {
        'getUpButton' : getUpButton,
        'getDownButton' : getDownButton,
        'getStepUpButton' : getStepUpButton,
        'getStepDownButton' : getStepDownButton,
        'getCloseButton' : getCloseButton
    };


});