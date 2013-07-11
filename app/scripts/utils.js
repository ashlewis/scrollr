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

        var classes = elem.classList;

        if (classes) {
            classes.remove(className);
        }

    },


    /**
     * [ description]
     * @param  {DOM element} el [description]
     * @return {int}    [description]
     */
    getOffsetBottom = function(el) {
        return window.innerHeight - (el.offsetTop + el.offsetHeight)
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
        'hasClass': hasClass,
        'addClass' : addClass,
        'removeClass' : removeClass,
        'getOffsetBottom' : getOffsetBottom,
        'calcLineHeight' : calcLineHeight,
        'snap' : snap
    };


});