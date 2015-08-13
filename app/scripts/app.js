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

      initDrag = function(clientY, resizer){
            var mouseOrigin = clientY,
                viewportTopOrigin = Dom.getViewport().offsetTop,
                viewportBottomOrigin = Utils.getOffsetBottom(Dom.getViewport());

            Utils.addClass(Dom.getPage(), 'resizing');
            Utils.addClass(Dom.getViewport(), 'resizing');
            Utils.addClass(Dom.getViewportResizerTop(), 'resizing');
            Utils.addClass(Dom.getViewportResizerBottom(), 'resizing');

           document.onmousemove = $.throttle(100, function(e){
               e.preventDefault();
               var delta = e.clientY - mouseOrigin;
               doDrag(resizer, delta, viewportTopOrigin, viewportBottomOrigin);
           });

            // document.onmousemove = function(e){
            //     e.preventDefault();
            //     var delta = e.clientY - mouseOrigin;
            //     doDrag(resizer, delta, viewportTopOrigin, viewportBottomOrigin);
            // };



        },

      doDrag = function(resizer, delta, viewportTopOrigin, viewportBottomOrigin){

        if (resizer === Dom.getViewportResizerBottom()) {
            delta = -delta;
        }

        if (delta >= 0 && Dom.getViewport().offsetHeight > 3*Dom.getLineHeight() ||
              delta < 0 && Dom.getViewport().offsetTop > 3*Dom.getLineHeight()) {

            Dom.getViewport().style.top = (viewportTopOrigin + delta) + 'px';
            Dom.getPage().style.paddingTop = (viewportTopOrigin + delta) + 'px';
            Dom.getViewport().style.bottom = (viewportBottomOrigin + delta) + 'px';
            Dom.getPage().style.paddingBottom = (viewportBottomOrigin + delta) + 'px';

        }

      },


      stopDrag = function(e){

          document.onmousemove = function(){};
          Utils.removeClass(Dom.getPage(), 'resizing');
          Utils.removeClass(Dom.getViewport(), 'resizing');
          Utils.removeClass(Dom.getViewportResizerTop(), 'resizing');
          Utils.removeClass(Dom.getViewportResizerBottom(), 'resizing');

          Dom.getViewport().style.top = Utils.snap(Dom.getViewport().offsetTop, Dom.getLineHeight()) + 'px';
          
          Dom.getViewport().style.bottom = $(window).height() - (Utils.snap(Dom.getViewport().offsetTop + Dom.getViewport().offsetHeight, Dom.getLineHeight())) +'px';

          if (Dom.getViewport().offsetTop < 3*Dom.getLineHeight()) {
            Dom.getViewport().style.top = 3*Dom.getLineHeight() + 'px';
          }

          if (Utils.getOffsetBottom(Dom.getViewport()) < 4*Dom.getLineHeight()) {
            Dom.getViewport().style.bottom = ($(window).height() - Utils.snap($(window).height() - 4*Dom.getLineHeight(), Dom.getLineHeight()))  +'px';
          }

          if (Dom.getViewport().offsetHeight < 3*Dom.getLineHeight()) {
            Dom.getViewport().style.top = Utils.snap($(window).height()/2 - 1.5*Dom.getLineHeight(), Dom.getLineHeight()) + 'px';
            Dom.getViewport().style.bottom = $(window).height() - (Utils.snap($(window).height()/2 - 1.5*Dom.getLineHeight(), Dom.getLineHeight()) + 3*Dom.getLineHeight()) + 'px';
          }

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

        if (distance > (Dom.getPage().clientHeight - $(window).height())) {
            distance = Math.floor((Dom.getPage().clientHeight - $(window).height()) / Dom.getLineHeight()) * Dom.getLineHeight();
        }

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);

//        if (distance + Dom.getLineHeight() + $(window).height() >= Dom.getPage().clientHeight && Dom.getViewport().style.top != 3*Dom.getLineHeight() +'px') {
//           Dom.resetViewport();
//        }
      },

      /**
      *
      */
      scrollUp = function(distance){

        var distance = (typeof distance === "undefined") ? Utils.snap((document.body.scrollTop - Dom.getViewport().clientHeight), Dom.getLineHeight()) : Utils.snap((document.body.scrollTop - distance), Dom.getLineHeight());

        $('body').animate({ scrollTop: distance }, 250, 'easeOutCirc', scrollComplete);

//        if (distance <= 0 && Dom.getViewport().style.top != 3*Dom.getLineHeight() +'px') {
//            Dom.resetViewport();
//        }

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
                    var viewportTopOrigin = Dom.getViewport().offsetTop,
                        viewportBottomOrigin = Utils.getOffsetBottom(Dom.getViewport());

                    doDrag(Dom.getViewportResizerTop(), -Dom.getLineHeight(), viewportTopOrigin, viewportBottomOrigin);
                    break;

                case KEY_DOWN_ARROW:
                    e.preventDefault();
                    var viewportTopOrigin = Dom.getViewport().offsetTop,
                        viewportBottomOrigin = Utils.getOffsetBottom(Dom.getViewport());

                    doDrag(Dom.getViewportResizerTop(), Dom.getLineHeight(), viewportTopOrigin, viewportBottomOrigin);
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