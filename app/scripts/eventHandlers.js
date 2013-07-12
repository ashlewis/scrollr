/*global define */
define(['jquery', 'utils', 'app', 'dom', 'swap', 'throttleDebounce'],
function ($, Utils, App, Dom, Swap) {
    'use strict';

    var

    handleBodyMouseWheel = function(e){
        e.preventDefault();
        App.wheelMove(e.wheelDelta);
    },

    handleBodyKeyDown = function(e){
        App.keyPress(e);
    },

    handleResizerMouseDown = function(e){
        e.preventDefault();
        App.initDrag(e.clientY, this);
    },

    handleWindowMouseUp = function(e){
        App.stopDrag(e);
    },

    handleWindowResize = function(){
        Dom.resetViewport();
    },

    handleWindowScroll = function(e){
        App.fixScrollTop();
    },

    isCloseTransition = function(propertyName){
        return (propertyName === 'top' && Dom.getViewport().style.top === '0px');
    },

    handleViewportTransitionEnd = function(e){

        if (isCloseTransition(e.propertyName)) {
            Swap.reset();

        }

        //if (Dom.getViewport().offsetTop >= 3*Dom.getLineHeight()) {
            //if (e.propertyName === 'top' && !Utils.hasClass(e.srcElement, 'resizing')) {
               // Dom.getViewport().style.bottom = window.innerHeight - (Utils.snap(Dom.getViewport().offsetTop, Dom.getLineHeight()) + Utils.snap(Dom.getViewport().offsetHeight, Dom.getLineHeight())) +'px';

           // }
        //}

    },

    handleUpClick = function(){
        App.scrollUp();
    },

    handleDownClick = function(){
        App.scrollDown();
    },

    handleStepUpClick = function(){
        App.scrollUp(Dom.getLineHeight());
    },

    handleStepDownClick = function(){
        App.scrollDown(Dom.getLineHeight());
    },

    handleCloseClick = function(){
        App.readingModeOff();
        unBindReadingModeEvents();
    },

    unBindReadingModeEvents = function(){

        document.body.removeEventListener('mousewheel', handleBodyMouseWheel);
        document.body.removeEventListener('keydown', handleBodyKeyDown);

        window.removeEventListener('mouseup', handleWindowMouseUp);


        //non-jquery version does not remove eventListener
          //window.removeEventListener('resize', resetViewport, true);
          $(window).off('resize', handleWindowResize);

          //non-jquery version does not remove eventListener
          //window.removeEventListener('scroll', fixScrollTop);
          $(window).off('scroll', handleWindowScroll);


    },

    bindReadingModeEvents = function(){
        document.body.addEventListener('mousewheel', handleBodyMouseWheel);
        document.body.addEventListener('keydown', handleBodyKeyDown);

        Dom.getViewportResizerTop().addEventListener('mousedown', handleResizerMouseDown);
        Dom.getViewportResizerBottom().addEventListener('mousedown', handleResizerMouseDown);
        window.addEventListener('mouseup', handleWindowMouseUp);

        //window.addEventListener('resize', $.debounce( 250, resetViewport));
        $(window).on('resize', $.debounce( 250, handleWindowResize));

        //window.addEventListener('scroll', $.debounce( 250, fixScrollTop));
        $(window).on('scroll', $.debounce( 250, handleWindowScroll));

        Dom.getViewport().addEventListener('transitionend', handleViewportTransitionEnd);

        Dom.getUpButton().addEventListener('click', handleUpClick);
        Dom.getDownButton().addEventListener('click', handleDownClick);
        Dom.getStepUpButton().addEventListener('click', handleStepUpClick);
        Dom.getStepDownButton().addEventListener('click', handleStepDownClick);
        Dom.getCloseButton().addEventListener('click', handleCloseClick);
    },

    candidateNodeClickHandler = function(e){

        App.readingModeOn(e.detail.target, e.detail.node);
        bindReadingModeEvents();
    },


    bindNonReadingModeEvents = function(){
        document.body.addEventListener('candidateNodeClick', candidateNodeClickHandler);
    },

    init = function(){
        bindNonReadingModeEvents();
    };

    return {
        'init' : init
    };

});