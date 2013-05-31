 /*global define */
define([], function () {

    var
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
    getOffsetTop = function (el) {

        var y = 0;

        while (el && !isNaN(el.offsetTop)) {
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        return y;
    },
    
    /**
    *
    */
    calcLineHeight = function(el){
      var style = window.getComputedStyle(el);

      return parseInt(style.getPropertyValue("line-height"), 10);

    },

    /**
    *
    */
    snap = function(yCoOrd, lineHeight){

        if (yCoOrd <= 0) {
            return 0;

        } else if (yCoOrd <= lineHeight) {
            return lineHeight;
        }

        return (Math.round((yCoOrd / lineHeight)) * lineHeight);
    };


    return {
        'addClass' : addClass,
        'removeClass' : removeClass,
        'getOffsetTop' : getOffsetTop,
        'calcLineHeight' : calcLineHeight,
        'snap' : snap
    };


});