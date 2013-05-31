/*global define */
define(['utils'], function (Utils) {
    'use strict';

    var

    HIGHLIGHT_CLASS = 'candidate-node-highlight',
    CANDIDATE_NODE_TYPES = 'div, article, main, aside',
    CANDIDATE_NODES_LIMIT = 10,

    /**
    *
    */
    highlight = function(e){

        Utils.addClass(this, HIGHLIGHT_CLASS);

        e.stopPropagation();

    },

    /**
    *
    */
    unHighlight = function(e){
        Utils.removeClass(this, HIGHLIGHT_CLASS);

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
        }

    },

    init = function(){
        bindEventHandlers();
    };


    return {
        'init' : init
    };


});