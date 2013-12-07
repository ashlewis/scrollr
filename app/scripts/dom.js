/*global define */
define(['utils'], function(Utils) {

    'use strict';

    var

      /**
      *
      */
      DOM = {
        page: false,
        viewport: false,
        viewportResizerTop: false,
        viewportResizerBottom: false,
        upButton : false,
        downButton : false,
        stepUpButton : false,
        stepDownButton : false,
        closeButton : false,
        pageLineHeight:false,
        controlGroup:false
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

        if (!DOM.upButton) {
          DOM.upButton = createButton('arrow-up');
        }

        return DOM.upButton;
      },

       /**
      *
      */
      getDownButton = function(){

        if (!DOM.downButton) {
          DOM.downButton = createButton('arrow-down');
        }

        return DOM.downButton;
      },

       /**
      *
      */
      getStepUpButton = function(){

        if (!DOM.stepUpButton) {
          DOM.stepUpButton = createButton('arrow-up step-up');
        }

        return DOM.stepUpButton;
      },

       /**
      *
      */
      getStepDownButton = function(){

        if (!DOM.stepDownButton) {
          DOM.stepDownButton = createButton('arrow-down step-down');
        }

        return DOM.stepDownButton;
      },

      /**
      *
      */
      getCloseButton = function(){

        if (!DOM.closeButton) {
          DOM.closeButton =  createButton('remove');
        }

        return DOM.closeButton;
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
      createControlGroup = function(){
        var controlGroup = document.createElement('div');

        controlGroup.className = 'control-group';

        controlGroup.appendChild(getViewportResizerTop());
        controlGroup.appendChild(getViewportResizerBottom());
        controlGroup.appendChild(getCloseButton());
        controlGroup.appendChild(getUpButton());
        controlGroup.appendChild(getDownButton());
        controlGroup.appendChild(getStepUpButton());
        controlGroup.appendChild(getStepDownButton());

        return controlGroup;
      },

      /**
      *
      */
      getControlGroup = function(){

        if (!DOM.controlGroup) {
          DOM.controlGroup = createControlGroup();
        }

        return DOM.controlGroup;
      },

      /**
      *
      */
      createViewport = function(){

        var viewport = document.createElement('div');

        viewport.className = 'viewport';
        viewport.appendChild(getControlGroup());
        

        return viewport;
      },

      /**
      *
      */
      createPage = function(){

        var page = document.createElement('div');

        page.className = 'page';

        return page;
      },

      /**
      *
      */
      getPage = function(){

        if (!DOM.page) {
          DOM.page = createPage();
        }

        return DOM.page;
      },

      /**
      *
      */
      getViewport = function(){

        if (!DOM.viewport) {
            DOM.viewport = createViewport();
        }

        return DOM.viewport;
      },

      getViewportResizerTop = function(){

        if (!DOM.viewportResizerTop) {
            DOM.viewportResizerTop = createViewportResizer('top');
        }

        return DOM.viewportResizerTop;

      },

      getViewportResizerBottom = function(){

        if (!DOM.viewportResizerBottom) {
            DOM.viewportResizerBottom = createViewportResizer('bottom');
        }

        return DOM.viewportResizerBottom;
      },

      /**
      *
      */
      resetViewport = function(){       
        //getViewport().style.height = 'auto';
        getViewport().style.top = 3*getLineHeight() +'px';
        //getViewport().style.bottom = (window.innerHeight - Utils.snap(window.innerHeight - 3*getLineHeight(), getLineHeight()))  +'px';
        getViewport().style.bottom = ($(window).height() - Utils.snap($(window).height() - 4*getLineHeight(), getLineHeight()))  +'px';
      },

       /**
        *
        */
        getLineHeight = function(){

            if (!DOM.pageLineHeight) {
                DOM.pageLineHeight = Utils.calcLineHeight(getPage());
            }

            return DOM.pageLineHeight;

        };


    return {
        'getPage' : getPage,
        'getViewport' : getViewport,
        'getViewportResizerTop' : getViewportResizerTop,
        'getViewportResizerBottom' : getViewportResizerBottom,
        'resetViewport': resetViewport,
        'getLineHeight': getLineHeight,
        'getUpButton' : getUpButton,
        'getDownButton' : getDownButton,
        'getStepUpButton' : getStepUpButton,
        'getStepDownButton' : getStepDownButton,
        'getCloseButton' : getCloseButton
    };


});