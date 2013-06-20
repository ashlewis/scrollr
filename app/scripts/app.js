/*global define */
define(
  [
    'jquery',
    'utils',
    'dom',
    'swap',
    'images',
    'throttleDebounce',
    'jqueryui',
    'baseline',
    'waitForImages',
    'domReady!'
  ],
  function (
      $,
      Utils,
      Dom,
      Swap,
      Images
  ){

    'use strict';

    var
      KEY_UP_ARROW = 38,
      KEY_DOWN_ARROW = 40,
      KEY_ESCAPE =  27,

      isScrolling = 0,     

      doDrag = function(clientY, delta){

        if ((clientY + delta) > 3*Dom.getLineHeight() && (window.innerHeight - (clientY + delta)) > 3*Dom.getLineHeight()) {
            resize(clientY, delta);
            Utils.addClass(Dom.getPage(), 'resizing');
            Utils.addClass(Dom.getViewport(), 'resizing');
            Utils.addClass(Dom.getViewportResizerTop(), 'resizing');
            Utils.addClass(Dom.getViewportResizerBottom(), 'resizing');
        }

        return false;
      },

      initDrag = function(clientY, resizer){
          //var delta = (Utils.getOffsetTop(resizer) + resizer.offsetHeight) - clientY;
           var delta = Dom.getViewport().offsetTop - clientY;

           console.log(delta);

          document.onmousemove = $.throttle(50, function(e){
              doDrag(e.clientY, delta);
          });

      },

      stopDrag = function(e){

          document.onmousemove = function(){};
          Utils.removeClass(Dom.getPage(), 'resizing');
          Utils.removeClass(Dom.getViewport(), 'resizing');
          Utils.removeClass(Dom.getViewportResizerTop(), 'resizing');
          Utils.removeClass(Dom.getViewportResizerBottom(), 'resizing');
          Dom.getViewport().style.top = Utils.snap(Utils.getOffsetTop(Dom.getViewport()), Dom.getLineHeight()) + 'px';

      },

      /**
      *
      */
      fixScrollTop = function (){

        $('body').animate({ scrollTop: Utils.snap(document.body.scrollTop, Dom.getLineHeight()) }, 300, 'easeOutCirc');
        
      },

    /**
    *
    */
    readingModeOn = function(target, content){

        Utils.addClass(document.body, 'reading');

        Swap.toggleNativeStyleSheets(true);
        Swap.setOriginalScrollTop(document.body.scrollTop);

        //DOM.page = getPage();

        Utils.addClass(target, 'target');
        Dom.getPage().innerHTML = content.innerHTML;
        Utils.removeClass(target, 'target');

        Swap.hideOriginalContent();

        document.body.appendChild(Dom.getPage());

        Dom.getPage().appendChild(Dom.getViewport());

        Images.baseLineImages();
      },

      /**
      *
      */
      readingModeOff = function(){

          Dom.getViewport().style.height = 'auto';
          Dom.getViewport().style.top = '0px';
          Dom.getViewport().style.bottom = '0px';

          Swap.toggleNativeStyleSheets(false);

          return false;
      },


      /**
      *
      */
      scrollComplete = function(){
        isScrolling = 0;
      },

      /**
      *
      */
      scrollDown = function(distance){

        var distance = (typeof distance === "undefined") ? Utils.snap((document.body.scrollTop + Dom.getViewport().clientHeight), Dom.getLineHeight()) : Utils.snap((document.body.scrollTop + distance), Dom.getLineHeight());

        if (distance > (Dom.getPage().clientHeight - window.innerHeight)) {
            distance = Math.floor((Dom.getPage().clientHeight - window.innerHeight) / Dom.getLineHeight()) * Dom.getLineHeight();
        }

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);

        if (distance + Dom.getLineHeight() + window.innerHeight >= Dom.getPage().clientHeight && Dom.getViewport().style.top != 3*Dom.getLineHeight() +'px') {
           Dom.resetViewport();
        }
      },

      /**
      *
      */
      scrollUp = function(distance){

        var distance = (typeof distance === "undefined") ? Utils.snap((document.body.scrollTop - Dom.getViewport().clientHeight), Dom.getLineHeight()) : Utils.snap((document.body.scrollTop - distance), Dom.getLineHeight());

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);

        if (distance <= 0 && Dom.getViewport().style.top != 3*Dom.getLineHeight() +'px') {
            Dom.resetViewport();
        }

      },

     
      /**
      *
      */
      wheelMove = function(wheelDelta){
        
        var delta = Math.max(-1, Math.min(1, wheelDelta));

        if (isScrolling) {
          return;
        }

        isScrolling = 1;

        if (delta < 0){
          scrollDown();

        } else {
          scrollUp();
        }

      },

      /**
      *
      */
      keyPress = function(e){

        if (e.ctrlKey) {

            switch (e.keyCode) {

                case KEY_UP_ARROW:
                    e.preventDefault(); 
                    doDrag(Dom.getViewport().offsetTop, -6);
  
                    break;

                case KEY_DOWN_ARROW:
                    e.preventDefault();
                    doDrag(Dom.getViewport().offsetTop, 6);
                    break;
            }

        } else {

            switch (e.keyCode) {

                case KEY_UP_ARROW:
                    e.preventDefault();
                    scrollUp();
                    break;

                case KEY_DOWN_ARROW:
                    e.preventDefault();
                    scrollDown();
                    break;

                case KEY_ESCAPE:
                    e.preventDefault();
                    readingModeOff();
                    break;
            }
        }

      },

    /**
      *
      */
     resize = function(clientY, delta){

       // header drag
       if (clientY+delta < (window.innerHeight/2 - Dom.getLineHeight()/2)) {
        Dom.getViewport().style.height = 'auto';
        Dom.getViewport().style.top = clientY+delta + 'px';
        Dom.getViewport().style.bottom = clientY+delta + 'px';
       }

       // footer drag
       if (clientY > (window.innerHeight/2 + Dom.getLineHeight()/2)) {
         Dom.getViewport().style.height = 'auto';
         Dom.getViewport().style.top = window.innerHeight - clientY + 'px';
         Dom.getViewport().style.bottom = window.innerHeight - clientY + 'px';
       }

    };


    return {
        'readingModeOn' : readingModeOn,
        'readingModeOff' : readingModeOff,
        'stopDrag': stopDrag,
        'initDrag': initDrag,
        'wheelMove': wheelMove,
        'keyPress': keyPress,
        'fixScrollTop': fixScrollTop,
        'scrollUp': scrollUp,
        'scrollDown': scrollDown
    };


});