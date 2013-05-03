/*global define */
define(['jquery', 'jqueryui', 'baseline', 'waitForImages'], function ($) {
    'use strict';

var
      HIGHLIGHT_CLASS = 'candidate-node-highlight',
      DRAGGING_CLASS = 'dragging',
      CANDIDATE_NODE_TYPES = 'div, article, main, aside',
      CANDIDATE_NODES_LIMIT = 10,

      /**
      *
      */
      DOM = {
        body: document.body,
        closeButton: false,
        page: false,
        viewport: false,
        viewportResizerTop: false,
        viewportResizerBottom: false,
        upButton:false,
        downButton:false,
        nudgeUpButton:false,
        nudgeDownButton:false
      },

      originalBodyHTML = '',

      scrollFlag = 0,

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
      getUpButton = function(){

        if (DOM.upButton) {
          return DOM.upButton;
        }

        return createButton('arrow-up', scrollUp);
      },

       /**
      *
      */
      getDownButton = function(){

        if (DOM.downButton) {
          return DOM.downButton;
        }

        return createButton('arrow-down', scrollDown);
      },

       /**
      *
      */
      getNudgeUpButton = function(){

        if (DOM.nudgeUpButton) {
          return DOM.nudgeUpButton;
        }

        return createButton('arrow-up nudge', scrollUp, /*DOM.page.lineHeight*/32);
      },

       /**
      *
      */
      getNudgeDownButton = function(){

        if (DOM.nudgeDownButton) {
          return DOM.nudgeDownButton;
        }

        return createButton('arrow-down nudge', scrollDown, /*DOM.page.lineHeight*/32);
      },


      /**
      *
      */
      getCloseButton = function(){

        if (DOM.closeButton) {
          return DOM.closeButton;
        }

        return createButton('remove', readingModeOff);
      },

      /**
      *
      */
      createViewportResizer = function(position){

        var viewportResizer = document.createElement('div'),
            text = document.createTextNode('....');

        viewportResizer.className = 'viewport-resizer viewport-resizer-'+ position;
        viewportResizer.draggable = 'true';
        viewportResizer.appendChild(text);

        return viewportResizer;
      },

      /**
      *
      */
      createViewport = function(){

        var viewport = document.createElement('div');

        viewport.className = 'viewport';

        DOM.viewportResizerTop = createViewportResizer('top');
        viewport.appendChild(DOM.viewportResizerTop);

        DOM.viewportResizerBottom = createViewportResizer('bottom');
        viewport.appendChild(DOM.viewportResizerBottom);

        return viewport;
      },

      /**
      *
      */
      getViewport = function(){

        if (DOM.viewport) {
          return DOM.viewport;
        }

        return createViewport();
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
      getPage = function(node){

        if (DOM.page){
          return DOM.page;
        }

        return createPage();

      },

      /**
      *
      */
      addReadingModeEventListeners = function(){

        DOM.page.addEventListener('mousewheel', wheelMove);
        document.body.addEventListener('keydown', keyPress);

        //DOM.viewportResizerTop.addEventListener('dragstart', dragStart, false);
        //DOM.viewportResizerBottom.addEventListener('dragstart', dragStart, false);

        DOM.page.addEventListener('dragover', dragOver, false);
        //DOM.page.addEventListener('drop', drop, false);
      },

      /**
      *
      */
      snap = function(yCoOrd){
        //@todo: use line height (for some reason i cant get any styles here
           return (Math.round((yCoOrd / DOM.page.lineHeight)) * DOM.page.lineHeight);
      },

      /**
      *
      */
      getOffset = function (el) {

        var x = 0,
            y = 0;

        while (el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop )) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        return { top: y, left: x };
    },

    /**
    *
    */
    calcLineHeight = function(){
      var style = window.getComputedStyle(DOM.page);

      return parseInt(style.getPropertyValue("line-height"), 10);

    },

    /**
    *
    */
    getLineHeight = function(){
      if (DOM.page.lineHeight){
        return DOM.page.lineHeight;
      }

      return calcLineHeight();

    },
      /**
      *
      */
      readingModeOn = function(e){

          var top, origHeight, newHeight, ratio;

          top = document.body.scrollTop;
          origHeight = this.clientHeight;

          DOM.page = getPage();
          DOM.page.innerHTML = this.innerHTML;

          DOM.viewport = getViewport();

          DOM.closeButton = getCloseButton();
          DOM.viewport.appendChild(DOM.closeButton);

          DOM.upButton = getUpButton();
          DOM.viewport.appendChild(DOM.upButton);

          DOM.downButton = getDownButton();
          DOM.viewport.appendChild(DOM.downButton);

          DOM.nudgeUpButton = getNudgeUpButton();
          DOM.viewport.appendChild(DOM.nudgeUpButton);

          DOM.nudgeDownButton = getNudgeDownButton();
          DOM.viewport.appendChild(DOM.nudgeDownButton);

          DOM.page.appendChild(DOM.viewport);


          originalBodyHTML = DOM.body.innerHTML;
          DOM.body.innerHTML = '';

          DOM.body.appendChild(DOM.page);

          DOM.page.lineHeight = getLineHeight();

         // $('img').baseline(DOM.page.lineHeight);

          $(document).waitForImages($.noop, function () {
                $(this).baseline(DOM.page.lineHeight);
            });

          //baseline.init('img', DOM.page.lineHeight);


          $('.viewport').animate({ top: '160px', bottom: '160px' }, 500, 'easeOutBack', function(){
            DOM.viewport.style.height = snap(DOM.viewport.clientHeight) +'px';
          });

          newHeight = DOM.page.clientHeight;
          ratio = newHeight/origHeight;

          DOM.body.scrollTop = snap(top*ratio + getOffset(DOM.viewport).top);

          addReadingModeEventListeners();

          e.preventDefault();
          e.stopPropagation();
      },

      /**
      *
      */
      readingModeOff = function(e){

          DOM.viewport.style.height = 'auto';

          $('.viewport').animate({ top: '0', bottom: '0' }, 500, 'easeOutBack',  function(){
            DOM.body.innerHTML = originalBodyHTML;
            init();
          });

          return false;
          //e.preventDefault();
          //e.stopPropagation();

      },
      /**
      *
      */
      scrollComplete = function(){
        scrollFlag = 0;
      },

      /**
      *
      */
      scrollDown = function(distance){

        var distance = (typeof distance === "undefined") ? snap(DOM.body.scrollTop + DOM.viewport.clientHeight) : snap(DOM.body.scrollTop + distance);

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);

      },

      /**
      *
      */
      scrollUp = function(distance){

        var distance = (typeof distance === "undefined") ? snap(DOM.body.scrollTop - DOM.viewport.clientHeight) : snap(DOM.body.scrollTop - distance);

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);

      },

      /**
      *
      */
      scroll = function(delta){

        if (delta < 0){
          scrollDown();

        } else {
          scrollUp();
        }

      },

      /**
      *
      */
      wheelMoveProcess = function(){
         var e = window.event || e,
            delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))),
            interval;

        scrollFlag = 1;

        scroll(delta);

      },

      /**
      *
      */
      wheelMove = function(e){

        e.preventDefault();

        if (scrollFlag) {
          return;
        }

        wheelMoveProcess();

      },

      /**
      *
      */
      keyPress = function(e){

		    e.preventDefault();

        if (e.keyCode === 40) {
          scrollDown();

        } else if (e.keyCode === 38) {
          scrollUp();
        }
      },

      hasClass = function(elem, className){
        return elem.className.indexOf(className) !== -1;
      },

      /**
      *
      */
      addClass = function(elem, className){

        if (!hasClass(elem, className)) {

          if (!elem.className){
            elem.className = className;

          } else {
            elem.className += ' '+ className;
          }
        }
      },

      /**
      *
      */
      removeClass = function(elem, className) {
        var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
        if (hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
      },

      /**
      *
      */
      dragStart = function(e) {

        return false;
      },

    /**
      *
      */
     resize = function(e){

       // header drag
       if (e.clientY < (window.innerHeight/2 - DOM.page.lineHeight/2)) {
        DOM.viewport.style.height = 'auto';
        DOM.viewport.style.top = snap(e.clientY) + 'px';
        DOM.viewport.style.bottom = snap(e.clientY) + 'px';
       }

       // footer drag
       if (e.clientY > (window.innerHeight/2 + DOM.page.lineHeight/2)) {
        DOM.viewport.style.height = 'auto';
        DOM.viewport.style.top = snap(window.innerHeight - e.clientY) + 'px';
        DOM.viewport.style.bottom = snap(window.innerHeight - e.clientY) + 'px';
       }
       DOM.viewport.style.height = snap(DOM.viewport.clientHeight) +'px';


    },


      /**
      *
      */
      dragOver = function(e) {

        if (e.clientY > 100 && (window.innerHeight - e.clientY) > 100) {
           resize(e);
        }

        return false;
      },


      /**
      *
      */
      drop = function(e) {

        DOM.viewport.style.height = snap(DOM.viewport.clientHeight) +'px';
        return false;
      },

      /**
      *
      */
      highlight = function(e){

        addClass(this, HIGHLIGHT_CLASS);

        e.stopPropagation();

      },

      /**
      *
      */
      unHighlight = function(e){
        removeClass(this, HIGHLIGHT_CLASS);

        e.stopPropagation();
      },

      /**
      *
      */
      sortElementsByArea = function(a, b) {
          var aArea = a.clientHeight * a.clientWidth,
              bArea = b.clientHeight * b.clientWidth;

          if (aArea  < bArea ) {
            return 1;

          } else if (aArea === bArea ) {
            return 0;

          } else {
            return -1;
          }
      },

      /**
      *
      */
      getCandidateNodes = function(){

        var nodeList = document.body.querySelectorAll(CANDIDATE_NODE_TYPES),
            nodeArray = Array.prototype.slice.call(nodeList);

        nodeList = document.body.querySelectorAll(CANDIDATE_NODE_TYPES);
        nodeArray = Array.prototype.slice.call(nodeList);

        nodeArray.sort(sortElementsByArea);

        return nodeArray.slice(0, CANDIDATE_NODES_LIMIT);
      },

      /**
      *
      */
      bindEventHandlers = function(){

        var nodes = getCandidateNodes();

        for (var i=nodes.length; i--;) {
            nodes[i].className = 'candidate-node';
            nodes[i].addEventListener('mouseover', highlight, false);
            nodes[i].addEventListener('mouseout', unHighlight, false);
            nodes[i].addEventListener('click', unHighlight, false);
            nodes[i].addEventListener('click', readingModeOn, false);
        }

      },

      /**
      *
      */
      init = function(){
        bindEventHandlers();
      };

    return {
        'init' : init
    };


});