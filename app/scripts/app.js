/*global define */
define(
  [
    'jquery',
    'utils',
    'candidateNodes',
    'controls',
    'throttleDebounce',
    'jqueryui',
    'baseline',
    'waitForImages',
    'domReady!'
  ],
  function (
      $,
      Utils,
      CandidateNodes,
      Controls
  )

  {
    'use strict';

    var

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
        spinDownButton:false,
        pageLineHeight:false
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

        return createButton('arrow-up step-up', scrollUp, getLineHeight());
      },

       /**
      *
      */
      getStepDownButton = function(){

        if (DOM.stepDownButton) {
          return DOM.stepDownButton;
        }

        return createButton('arrow-down step-down', scrollDown, getLineHeight());
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
        console.log('resetViewport');
        DOM.viewport.style.height = 'auto';
        DOM.viewport.style.top = 3*getLineHeight() +'px';
        DOM.viewport.style.bottom = 3*getLineHeight() +'px';
      },


      startDrag = function(e){

          e.preventDefault();

          var delta = (Utils.getOffsetTop(this) + this.offsetHeight) - e.clientY;

          document.onmousemove = $.throttle(50, function(e){
            if ((e.clientY + delta) > 3*getLineHeight() && (window.innerHeight - (e.clientY + delta)) > 3*getLineHeight()) {
                resize(e, delta);
                Utils.addClass(DOM.page, 'resizing');
                Utils.addClass(DOM.viewport, 'resizing');
                Utils.addClass(DOM.viewportResizerTop, 'resizing');
                Utils.addClass(DOM.viewportResizerBottom, 'resizing');
            }

            return false;
          });

      },

      stopDrag = function(e){

          document.onmousemove = function(){};
          Utils.removeClass(DOM.page, 'resizing');
          Utils.removeClass(DOM.viewport, 'resizing');
          Utils.removeClass(DOM.viewportResizerTop, 'resizing');
          Utils.removeClass(DOM.viewportResizerBottom, 'resizing');
          DOM.viewport.style.top = Utils.snap(Utils.getOffsetTop(DOM.viewport), getLineHeight()) + 'px';

      },

      /**
      *
      */
      addReadingModeEventListeners = function(){

        DOM.body.addEventListener('mousewheel', wheelMove);
        DOM.body.addEventListener('keydown', keyPress);

        DOM.viewportResizerTop.addEventListener('mousedown', startDrag);
        DOM.viewportResizerBottom.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);

        //window.addEventListener('resize', $.debounce( 250, resetViewport));
        $(window).on('resize', $.debounce( 250, resetViewport));

        //window.addEventListener('scroll', $.debounce( 250, fixScrollTop));
        $(window).on('scroll', $.debounce( 250, fixScrollTop));

        DOM.viewport.addEventListener('transitionend', function(){

            if (DOM.viewport.style.top === '0px') {
                reset();
            }

            DOM.viewport.style.height = Utils.snap(DOM.viewport.clientHeight, getLineHeight()) +'px';


        });

      },

      fixScrollTop = function (){
        console.log('fixScrollTop');
        $('body').animate({ scrollTop: Utils.snap(DOM.body.scrollTop, getLineHeight()) }, 300, 'easeOutCirc');

      },

    /**
    *
    */
    getLineHeight = function(){
      if (DOM.pageLineHeight){
        return DOM.pageLineHeight;
      }

      return DOM.pageLineHeight = Utils.calcLineHeight(DOM.page);

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

          Utils.addClass(e.srcElement, 'target');

          toggleNativeStyleSheets(true);

          DOM.page = getPage();
          DOM.page.innerHTML = this.innerHTML;

          Utils.removeClass(e.srcElement, 'target');

          originalBodyHTML = DOM.body.innerHTML;
          originalScrollTop = DOM.body.scrollTop;

          DOM.body.innerHTML = '';

          DOM.body.appendChild(DOM.page);

          DOM.viewport = getViewport();
          DOM.page.appendChild(DOM.viewport);

          DOM.closeButton = getCloseButton();
          DOM.viewport.appendChild(DOM.closeButton/*Controls.getCloseButton()*/);

          DOM.upButton = getUpButton();
          DOM.viewport.appendChild(DOM.upButton);

          DOM.downButton = getDownButton();
          DOM.viewport.appendChild(DOM.downButton);

          DOM.stepUpButton = getStepUpButton();
          DOM.viewport.appendChild(DOM.stepUpButton);

          DOM.stepDownButton = getStepDownButton();
          DOM.viewport.appendChild(DOM.stepDownButton);

          Utils.addClass(DOM.body, 'reading');

          $(document).waitForImages(
              // all loaded
              function(){
                DOM.body.scrollTop = Utils.snap(document.querySelector('.target').offsetTop - 3*getLineHeight(), getLineHeight());

                resetViewport();
              },
              // each image
              function () {

                $(this).baseline(getLineHeight());

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
          DOM.viewport.style.top = '0px';
          DOM.viewport.style.bottom = '0px';

          DOM.body.removeEventListener('mousewheel', wheelMove);
          DOM.body.removeEventListener('keydown', keyPress);

          window.removeEventListener('mouseup', stopDrag);

          //non-jquery version does not remove eventListener
          //window.removeEventListener('resize', resetViewport, true);
          $(window).off('resize', resetViewport);

          //non-jquery version does not remove eventListener
          //window.removeEventListener('scroll', fixScrollTop);
          $(window).off('scroll', fixScrollTop);

          toggleNativeStyleSheets(false);

          return false;
      },

      reset = function(){
          DOM.body.innerHTML = originalBodyHTML;
          DOM.body.scrollTop = originalScrollTop;
          init();
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

        var distance = (typeof distance === "undefined") ? Utils.snap((DOM.body.scrollTop + DOM.viewport.clientHeight), getLineHeight()) : Utils.snap((DOM.body.scrollTop + distance), getLineHeight());

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);

        if (distance + window.innerHeight > DOM.page.clientHeight  && DOM.viewport.style.top != '96px' ) {
           resetViewport();
        }
      },

      /**
      *
      */
      scrollUp = function(distance){

        var distance = (typeof distance === "undefined") ? Utils.snap((DOM.body.scrollTop - DOM.viewport.clientHeight), getLineHeight()) : Utils.snap((DOM.body.scrollTop - distance), getLineHeight());

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);



        if (distance <= 0 && DOM.viewport.style.top != 3*getLineHeight() +'px') {
            resetViewport();
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
      wheelMoveProcess = function(e){
         var e = window.event || e,
            delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            console.log(e);
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
     resize = function(e, delta){

       // header drag
       if (e.clientY+delta < (window.innerHeight/2 - getLineHeight()/2)) {
        DOM.viewport.style.height = 'auto';
        DOM.viewport.style.top = e.clientY+delta + 'px';
        DOM.viewport.style.bottom = e.clientY+delta + 'px';
       }

       // footer drag
       if (e.clientY > (window.innerHeight/2 + getLineHeight()/2)) {
         DOM.viewport.style.height = 'auto';
         DOM.viewport.style.top = window.innerHeight - e.clientY + 'px';
         DOM.viewport.style.bottom = window.innerHeight - e.clientY + 'px';
       }

    },

      /**
      *
      */
      bindEventHandlers = function(){
        var candidateNodes = document.querySelectorAll('.candidate-node');

        [].forEach.call(candidateNodes, function(candidateNode) {
            candidateNode.addEventListener('click', readingModeOn, false);
        });

      },

      /**
      *
      */
      init = function(){
          CandidateNodes.init();
          bindEventHandlers();
      };

    return {
        'init' : init
    };


});