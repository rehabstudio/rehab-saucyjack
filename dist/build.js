'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SaucyJack = exports.SaucyJack = function () {
    function SaucyJack() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, SaucyJack);

        /**
         * @property {object} DEBUG -  Show the scroll line on the screen.
         * @property {object} TRIGGER_LINE_POS - Percentile Y co-ordinate (from 0 to 1) where the imaginary trigger line is in the viewport. Entities get 'triggered' when their top edge hits this line.
         * @property {object} ENTITY_SELECTOR - A selector that we will grab on init to set up the list of elements to watch
         * @property {object} ACTIVE_CLASS - The class we give any watched element when it goes over the trigger line.
         * @property {object} INVERT_BEHAVIOUR - If true, the class is removed instead of added when it crosses the line, and vice versa.  Good for 'release'-style transitions-in.
         */
        var defaults = {
            DEBUG: false,
            TRIGGER_LINE_POS: 0.85,
            ENTITY_SELECTOR: '.saucy-el',
            ACTIVE_CLASS: 'saucy-active',
            INVERT_BEHAVIOUR: false
        };

        // Checking if the passed 'options' param is an object. If its not then set it to the defaults.
        if (options instanceof Object || !options instanceof Array) {

            options.DEBUG = options.DEBUG ? options.DEBUG : defaults.DEBUG;
            options.TRIGGER_LINE_POS = options.TRIGGER_LINE_POS ? options.TRIGGER_LINE_POS : defaults.TRIGGER_LINE_POS;
            options.ENTITY_SELECTOR = options.ENTITY_SELECTOR ? options.ENTITY_SELECTOR : defaults.ENTITY_SELECTOR;
            options.ACTIVE_CLASS = options.ACTIVE_CLASS ? options.ACTIVE_CLASS : defaults.ACTIVE_CLASS;
            options.INVERT_BEHAVIOUR = options.INVERT_BEHAVIOUR ? options.INVERT_BEHAVIOUR : defaults.INVERT_BEHAVIOUR;
        } else {
            options = defaults;
        }

        this.options = options;

        this._entities = [];
        this._triggerLinePixelPos = 0;
        this._scrollPos = 0;
        this._debugEl = null;

        var els = document.querySelectorAll(this.options.ENTITY_SELECTOR);
        for (var i = 0, ln = els.length; i < ln; i++) {
            this.addElement(els[i]);
        }

        this._getScrollPos();
        this._updateTriggerLine();
        this._updateEntities();

        if (this.options.DEBUG) {
            this._debugEl = document.createElement('div');
            this._debugEl.classList.add('saucy-debug');
            document.body.appendChild(this._debugEl);
            this._updateDebugEl();
        }

        window.addEventListener('resize', this._onResize.bind(this), false);
        window.addEventListener('scroll', this._onScroll.bind(this), false);
    }

    // Get the top edge positions of the entities on the page.
    // NICETOHAVE: allow for triggering from the center or bottom edge of the el,
    // not just from the top.


    _createClass(SaucyJack, [{
        key: '_updateEntities',
        value: function _updateEntities() {
            this._entities.forEach(function (ent) {
                ent.yTop = ent.el.getBoundingClientRect().top;

                // TODO: check if element is 'in range' and ignore if it isn't

                var isActive = this._triggerLinePixelPos > ent.yTop;
                this._setActiveStatus(ent, isActive);
            }.bind(this));
        }

        // Update the current scroll position (the top of the viewport).

    }, {
        key: '_getScrollPos',
        value: function _getScrollPos() {
            this._scrollPos = window.scrollY || (window.pageYOffset || document.body.scrollTop) - (document.body.clientTop || 0);
        }

        // Work out the actual pixel position of the 'trigger line' based on the viewport
        // size and the trigger percentage.

    }, {
        key: '_updateTriggerLine',
        value: function _updateTriggerLine() {
            this._triggerLinePixelPos = Math.round((window.innerHeight || document.documentElement.clientHeight) * this.options.TRIGGER_LINE_POS);
        }

        // Add or remove the active attribute and class for the entity.

    }, {
        key: '_setActiveStatus',
        value: function _setActiveStatus(ent, isActive) {
            if (isActive === undefined) isActive = true;
            if (ent.active === isActive) return;
            ent.active = isActive;
            var fn = isActive && !this.options.INVERT_BEHAVIOUR ? 'add' : 'remove';
            ent.el.classList[fn](this.options.ACTIVE_CLASS);
        }

        // Callback for the resize event. Re-calcs the positions of our entities.
        // NICETOHAVE: debounce

    }, {
        key: '_onResize',
        value: function _onResize() {
            this._updateTriggerLine();
            this._updateEntities();
            if (this.options.DEBUG) this._updateDebugEl();
        }

        // Callback for the resize event. Iterates the entities and add/removes the 'active'
        // status if they've gone over the trigger line.

    }, {
        key: '_onScroll',
        value: function _onScroll() {
            this._getScrollPos();
            this._updateEntities();
            if (this.options.DEBUG) this._updateDebugEl();
        }

        // Updates the debug el.

    }, {
        key: '_updateDebugEl',
        value: function _updateDebugEl() {
            this._debugEl.style.top = this._triggerLinePixelPos + 'px';
        }

        // Add a wrapper object for an element to our 'watch list' for later use.
        // NICETOHAVE: de-duplicate

    }, {
        key: 'addElement',
        value: function addElement(el) {
            var elObj = {
                el: el,
                yTop: 0,
                active: false
            };
            this._entities.push(elObj);
        }

        // Init code.  Get our elements, store their positions,
        // and set up the resize & scroll listeners.
        // init() {
        //     var els = document.querySelectorAll(ENTITY_SELECTOR);
        //     for(var i = 0, ln = els.length; i < ln; i++) {
        //         addElement(els[i]);
        //     }

        //     _getScrollPos();
        //     _updateTriggerLine();
        //     _updateEntities();

        //     if(DEBUG) {
        //         _debugEl = document.createElement('div');
        //         _debugEl.classList.add('saucy-debug');
        //         document.body.appendChild(_debugEl);
        //         _updateDebugEl();
        //     }

        //     window.addEventListener('resize', _onResize, false);
        //     window.addEventListener('scroll', _onScroll, false);
        // }

        // // Exposed API for this module.
        // return {
        //     init: init,
        //     add: addElement
        // }

    }]);

    return SaucyJack;
}();

/*
// "...Well if it isn't SAUCY JACK!"

// Note: this is very verbose and broken down into little bits.  It could be
// made way easier to read at the cost of being explicit - it's just an example
// of the technique.
var SaucyJack = (function() {
    
    // Show the scroll line on the screen.
    var DEBUG = true;
    
    // TODO: expose these constants as options for init()
    
    // Percentile Y co-ordinate (from 0 to 1) where the imaginary trigger line is in the viewport.
    // Entities get 'triggered' when their top edge hits this line.
    var TRIGGER_LINE_POS = 0.85;
    
    // A selector that we will grab on init to set up the list of elements to watch
    var ENTITY_SELECTOR = '.saucy-el';
    
    // The class we give any watched element when it goes over the trigger line.
    var ACTIVE_CLASS = 'saucy-active';
    
    // If true, the class is removed instead of added when it crosses the line,
    // and vice versa.  Good for 'release'-style transitions-in.
    var INVERT_BEHAVIOUR = false;
    
    // An array of elements that our engine is concerned with, wrapped in objects that
    // cache their position and status. Better than testing every damn thing in the DOM.
    var _entities = [];
    
    // The actual pixel position of the 'trigger line', calculated at runtime.
    var _triggerLinePixelPos = 0;
    
    // The current scroll position in pixels.  Updated by the _onScroll.
    var _scrollPos = 0;
    
    var _debugEl;
    
    // Get the top edge positions of the entities on the page.
    // NICETOHAVE: allow for triggering from the center or bottom edge of the el,
    // not just from the top.
    function _updateEntities() {
        _entities.forEach(function(ent) {
            ent.yTop = ent.el.getBoundingClientRect().top;
            
            // TODO: check if element is 'in range' and ignore if it isn't
            
            var isActive = (_triggerLinePixelPos > ent.yTop);
            _setActiveStatus(ent, isActive);
        });
    }
    
    // Update the current scroll position (the top of the viewport).
    function _getScrollPos() {
        _scrollPos = window.scrollY || ((window.pageYOffset || document.body.scrollTop) - (document.body.clientTop || 0));
    }

    // Work out the actual pixel position of the 'trigger line' based on the viewport
    // size and the trigger percentage.
    function _updateTriggerLine() {
        _triggerLinePixelPos = Math.round((window.innerHeight || document.documentElement.clientHeight) * TRIGGER_LINE_POS);
    }
    
    // Add or remove the active attribute and class for the entity.
    function _setActiveStatus(ent, isActive) {
        if (isActive === undefined) isActive = true;
        if(ent.active === isActive) return;
        ent.active = isActive;
        var fn = (isActive && !INVERT_BEHAVIOUR) ? 'add' : 'remove';
        ent.el.classList[fn](ACTIVE_CLASS);
    }
    
    // Callback for the resize event. Re-calcs the positions of our entities.
    // NICETOHAVE: debounce
    function _onResize() {
        _updateTriggerLine();
        _updateEntities();
        if (DEBUG) _updateDebugEl();
    }
    
    // Callback for the resize event. Iterates the entities and add/removes the 'active'
    // status if they've gone over the trigger line.
    function _onScroll() {
        _getScrollPos();
        _updateEntities();
        if (DEBUG) _updateDebugEl();
    }
    
    // Updates the debug el.
    function _updateDebugEl() {        
        _debugEl.style.top = _triggerLinePixelPos + 'px';
    }
    
    // Add a wrapper object for an element to our 'watch list' for later use.
    // NICETOHAVE: de-duplicate
    function addElement(el) {
        var elObj = {
            el: el,
            yTop: 0,
            active: false
        };
        _entities.push(elObj);    
    }
    
    // Init code.  Get our elements, store their positions,
    // and set up the resize & scroll listeners.
    function init() {
        var els = document.querySelectorAll(ENTITY_SELECTOR);
        for(var i = 0, ln = els.length; i < ln; i++) {
            addElement(els[i]);
        }

        _getScrollPos();
        _updateTriggerLine();
        _updateEntities();
        
        if(DEBUG) {
            _debugEl = document.createElement('div');
            _debugEl.classList.add('saucy-debug');
            document.body.appendChild(_debugEl);
            _updateDebugEl();
        }
        
        window.addEventListener('resize', _onResize, false);
        window.addEventListener('scroll', _onScroll, false);
    }
    
    // Exposed API for this module.
    return {
        init: init,
        add: addElement
    }
    
})();

// DO IT!
SaucyJack.init();

*/

//# sourceMappingURL=build.js.map