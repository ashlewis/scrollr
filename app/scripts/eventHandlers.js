/*global define */
define(['jquery', 'utils', 'app', 'dom', 'swap', 'throttleDebounce'],
function ($, Utils, App, Dom, Swap) {
    'use strict';

    var

    /**
    * @param {Event} e
    */
    handleBodyMouseWheel = function(e){
        e.preventDefault();
        App.wheelMove(e.wheelDelta);
    },

    /**
    * @param {Event} e
    */
    handleBodyKeyDown = function(e){
        App.keyPress(e);
    },

    /**
    * @param {Event} e
    */
    handleResizerMouseDown = function(e){
        e.preventDefault();
        App.initDrag(e.clientY, this);
    },

    /**
    * @param {Event} e
    */
    handleWindowMouseUp = function(e){
        App.stopDrag(e);
    },

    /**
    * @param {Event} e
    */
    handleWindowResize = function(){
        Dom.resetViewport();
    },

    /**
    * @param {Event} e
    */
    handleWindowScroll = function(e){
        App.fixScrollTop();
    },

    /**
    * @param {string} propertyName - transitioned css property
    */
    isCloseTransition = function(propertyName){
        return (propertyName === 'top' && Dom.getViewport().style.top === '0px');
    },

    /**
    * @param {Event} e
    */
    handleViewportTransitionEnd = function(e){

        if (isCloseTransition(e.propertyName)) {
            Swap.reset();

        }
        Dom.getPage().style.paddingTop = Dom.getViewport().offsetTop + 'px';
        Dom.getPage().style.paddingBottom = Utils.getOffsetBottom(Dom.getViewport()) + 'px';

    },

    /**
    *
    */
    handleUpClick = function(){
        App.scrollUp();
    },

    /**
    *
    */
    handleDownClick = function(){
        App.scrollDown();
    },

    /**
    *
    */
    handleStepUpClick = function(){
        App.scrollUp(Dom.getLineHeight());
    },

    /**
    *
    */
    handleStepDownClick = function(){
        App.scrollDown(Dom.getLineHeight());
    },

    /**
    *
    */
    handleCloseClick = function(){
        App.readingModeOff();
        unBindReadingModeEvents();
    },

    /**
    *
    */
    unBindReadingModeEvents = function(){

        document.body.removeEventListener('mousewheel', handleBodyMouseWheel);
        document.body.removeEventListener('keydown', handleBodyKeyDown);

        window.removeEventListener('mouseup', handleWindowMouseUp);

        $(window).off('resize', handleWindowResize);

        $(window).off('scroll', handleWindowScroll);

    },

    /**
    *
    */
    bindReadingModeEvents = function(){
        document.body.addEventListener('mousewheel', handleBodyMouseWheel);
        document.body.addEventListener('keydown', handleBodyKeyDown);

        Dom.getViewportResizerTop().addEventListener('mousedown', handleResizerMouseDown);
        Dom.getViewportResizerBottom().addEventListener('mousedown', handleResizerMouseDown);
        window.addEventListener('mouseup', handleWindowMouseUp);

        $(window).on('resize', $.debounce( 250, handleWindowResize));

        $(window).on('scroll', $.debounce( 250, handleWindowScroll));

        Dom.getViewport().addEventListener('transitionend', handleViewportTransitionEnd);

        Dom.getUpButton().addEventListener('click', handleUpClick);
        Dom.getDownButton().addEventListener('click', handleDownClick);
        Dom.getStepUpButton().addEventListener('click', handleStepUpClick);
        Dom.getStepDownButton().addEventListener('click', handleStepDownClick);
        Dom.getCloseButton().addEventListener('click', handleCloseClick);
    },

    /**
    *
    */
    candidateNodeClickHandler = function(e){

        App.readingModeOn(e.detail.target, e.detail.node);
        bindReadingModeEvents();
    },

    /**
    *
    */
    bindNonReadingModeEvents = function(){
        document.body.addEventListener('candidateNodeClick', candidateNodeClickHandler);
    },
    
    /**
    *
    */
    init = function(){
        bindNonReadingModeEvents();
    };

    return {
        'init' : init
    };

});