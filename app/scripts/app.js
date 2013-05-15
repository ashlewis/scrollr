/*global define */
define(['jquery', 'jqueryui', 'baseline', 'waitForImages', 'domReady!'], function ($) {
    'use strict';

var
      HIGHLIGHT_CLASS = 'candidate-node-highlight',
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
        stepUpButton:false,
        stepDownButton:false,
        spinUpButton:false,
        spinDownButton:false
      },

      originalBodyHTML = '',

      originalScrollTop = 0,

      scrollFlag = 0,

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
      getStepUpButton = function(){

        if (DOM.stepUpButton) {
          return DOM.stepUpButton;
        }

        return createButton('arrow-up step-up', scrollUp, /*DOM.page.lineHeight*/32);
      },

       /**
      *
      */
      getStepDownButton = function(){

        if (DOM.stepDownButton) {
          return DOM.stepDownButton;
        }

        return createButton('arrow-down step-down', scrollDown, /*DOM.page.lineHeight*/32);
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
       // viewportResizer.draggable = 'true';
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
      resetViewport = function(){
        DOM.viewport.style.height = 'auto';
        DOM.viewport.style.top = '160px';
        DOM.viewport.style.bottom = '160px';
        DOM.viewport.style.height = snap(DOM.viewport.clientHeight) +'px';
      },


      startDrag = function(e){

          e.preventDefault();

          document.onmousemove = function(e){
            if (e.clientY > 100 && (window.innerHeight - e.clientY) > 100) {
                resize(e);
                addClass(DOM.page, 'resizing');
            }           

            return false;
          };
      },

      stopDrag = function(e){
          document.onmousemove = function(){};
          removeClass(DOM.page, 'resizing');
      },
  
      /**
      *
      */
      addReadingModeEventListeners = function(){

        DOM.page.addEventListener('mousewheel', wheelMove);
        document.body.addEventListener('keydown', keyPress);

        DOM.viewportResizerTop.addEventListener('mousedown', startDrag);
        DOM.viewportResizerBottom.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);

        window.addEventListener('resize', resetViewport);

      },

      /**
      *
      */
      snap = function(yCoOrd){

        if (yCoOrd <= 0) {
            return 0;
            
        } else if (yCoOrd <= DOM.page.lineHeight) {
            return DOM.page.lineHeight;
        }

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
    toggleNativeStyleSheets = function(toggle){
        for (var i = document.styleSheets.length; i--;) {
            if (document.styleSheets[i].media.mediaText != 'screen, scrollr') {
                document.styleSheets[i].disabled = toggle;
            }
        }
    },

      /**
      *
      */
      readingModeOn = function(e){

          addClass(e.srcElement, 'target');
          
          toggleNativeStyleSheets(true);

          DOM.page = getPage();
          DOM.page.innerHTML = this.innerHTML;

          removeClass(e.srcElement, 'target');

          DOM.viewport = getViewport();

          DOM.closeButton = getCloseButton();
          DOM.viewport.appendChild(DOM.closeButton);

          DOM.upButton = getUpButton();
          DOM.viewport.appendChild(DOM.upButton);

          DOM.downButton = getDownButton();
          DOM.viewport.appendChild(DOM.downButton);

          DOM.stepUpButton = getStepUpButton();
          DOM.viewport.appendChild(DOM.stepUpButton);

          DOM.stepDownButton = getStepDownButton();
          DOM.viewport.appendChild(DOM.stepDownButton);

          DOM.page.appendChild(DOM.viewport);

          originalBodyHTML = DOM.body.innerHTML;
          originalScrollTop = DOM.body.scrollTop;
    
          DOM.body.innerHTML = '';

          DOM.body.appendChild(DOM.page);          

          DOM.page.lineHeight = getLineHeight();

          $(document).waitForImages($.noop, function () {
                $(this).baseline(DOM.page.lineHeight);
                // @todo: why is this not the same as jquery version below??
                // console.log(getOffset(document.querySelector('.target')).top);
                // @todo: fix initial scroll when user does not click on paragraph/image/heading
                DOM.body.scrollTop = snap($('.target').offset().top - 160);
            });

          $('.viewport').animate({ top: '160px', bottom: '160px' }, 500, 'easeOutBack', function(){
            DOM.viewport.style.height = snap(DOM.viewport.clientHeight) +'px';
          });          

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
            DOM.body.scrollTop = originalScrollTop;
            init();
          });

          toggleNativeStyleSheets(false);

          return false;
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

        if (distance + window.innerHeight > DOM.page.clientHeight) {
            DOM.viewport.style.height = 'auto';
            $('.viewport').animate({ top: '160px', bottom: '160px' }, 500, 'easeOutBack', function(){
                DOM.viewport.style.height = snap(DOM.viewport.clientHeight) +'px';
            });
        }
      },

      /**
      *
      */
      scrollUp = function(distance){

        var distance = (typeof distance === "undefined") ? snap(DOM.body.scrollTop - DOM.viewport.clientHeight) : snap(DOM.body.scrollTop - distance);

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);
        
        if (distance <= 0) {
            DOM.viewport.style.height = 'auto';
            $('.viewport').animate({ top: '160px', bottom: '160px' }, 500, 'easeOutBack', function(){
                DOM.viewport.style.height = snap(DOM.viewport.clientHeight) +'px';
            });
        }

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
            delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

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

        if (e.keyCode === 40) {
          scrollDown();
          e.preventDefault();

        } else if (e.keyCode === 38) {
          scrollUp();
          e.preventDefault();
        }
      },

      /**
      *
      */
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