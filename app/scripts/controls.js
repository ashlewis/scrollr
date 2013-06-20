/*global define */
define([], function () {

    'use strict';

    var

      CONTROLS = {
        upButton : false,
        downButton : false,
        stepUpButton : false,
        stepDownButton : false,
        closeButton : false
      },

     /**
      *
      */
      createButton = function(type){
        var link = document.createElement('a'),
            icon = document.createElement('i');

        link.className = 'button '+ type;
        icon.className = 'icon-'+ type;
        icon.unselectable = "on";

        link.appendChild(icon);
       
        return link;
      },

      /**
      *
      */
      getUpButton = function(){

        if (!CONTROLS.upButton) {
          CONTROLS.upButton = createButton('arrow-up');
        }

        return CONTROLS.upButton;
      },

       /**
      *
      */
      getDownButton = function(){

        if (!CONTROLS.downButton) {
          CONTROLS.downButton = createButton('arrow-down');
        }

        return CONTROLS.downButton;
      },

       /**
      *
      */
      getStepUpButton = function(){

        if (!CONTROLS.stepUpButton) {
          CONTROLS.stepUpButton = createButton('arrow-up step-up');
        }

        return CONTROLS.stepUpButton;
      },

       /**
      *
      */
      getStepDownButton = function(){

        if (!CONTROLS.stepDownButton) {
          CONTROLS.stepDownButton = createButton('arrow-down step-down');
        }

        return CONTROLS.stepDownButton;
      },

      /**
      *
      */
      getCloseButton = function(){

        if (!CONTROLS.closeButton) {
          CONTROLS.closeButton =  createButton('remove');
        }

        return CONTROLS.closeButton;
      };


    return {
        'getUpButton' : getUpButton,
        'getDownButton' : getDownButton,
        'getStepUpButton' : getStepUpButton,
        'getStepDownButton' : getStepDownButton,
        'getCloseButton' : getCloseButton
    };


});