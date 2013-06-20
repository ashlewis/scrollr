/*global define */
define(['utils'], function (Utils) {
    
    'use strict';

    var

    NODE_CLASS = 'candidate_node',
    HIGHLIGHT_CLASS = 'candidate-node-highlight',
    CANDIDATE_NODE_TYPES = 'div, article, main, aside',
    CANDIDATE_NODES_LIMIT = 10,

    /**
    *
    */
    highlight = function(elem){
        Utils.addClass(elem, HIGHLIGHT_CLASS);

    },

    /**
    *
    */
    unHighlight = function(elem){
        Utils.removeClass(elem, HIGHLIGHT_CLASS);
    },
    
    /**
    *
    */
    handleCandidateNodeMouseOver = function(e){
        e.stopPropagation();
        highlight(this);
        
    },
    
    /**
    *
    */
    handleCandidateNodeMouseOut = function(e){
       e.stopPropagation();
       unHighlight(this);
    },
    
    /**
    *
    */
    handleCandidateNodeClick = function(e){

        e.preventDefault();
        e.stopPropagation();

        unHighlight(this);

        var candidateNodeClickEvent = new CustomEvent('candidateNodeClick', {
            detail: {
                target : e.srcElement,
                node: this                
            },
            bubbles: true,
            cancelable: false
        });

        document.body.dispatchEvent(candidateNodeClickEvent);
  
    },

    /**
    *
    */
    bindEventsHandlers = function(){
        var candidateNodes = document.querySelectorAll('.'+ NODE_CLASS);

        [].forEach.call(candidateNodes, function(candidateNode) {
            candidateNode.addEventListener('mouseover', handleCandidateNodeMouseOver, false);
            candidateNode.addEventListener('mouseout', handleCandidateNodeMouseOut, false);
            candidateNode.addEventListener('click', handleCandidateNodeClick, false);
        });

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
    identifyCandidateNodes = function(){
        [].forEach.call(getCandidateNodes(), function(node){
            node.className = NODE_CLASS;
        });
    },

    /**
    *
    */
    init = function(){
        identifyCandidateNodes();
        bindEventsHandlers();
    };

    return {
        'init' : init
    };


});