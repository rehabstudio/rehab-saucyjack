(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
         * @property {Object} DEBUG -  Show the scroll line on the screen.
         * @property {Object} TRIGGER_LINE_POS - Percentile Y co-ordinate (from 0 to 1) where the imaginary trigger
         * line is in the viewport. Entities get 'triggered' when their top edge hits this line.
         * @property {Object} ENTITY_SELECTOR - A selector that we will grab on init to set up the list of elements to
         * watch
         * @property {Object} ACTIVE_CLASS - The class we give any watched element when it goes over the trigger line.
         * @property {Object} INVERT_BEHAVIOUR - If true, the class is removed instead of added when it crosses the
         * line, and vice versa.  Good for 'release'-style transitions-in.
         */
        var defaults = {
            DEBUG: false,
            TRIGGER_LINE_POS: 0.85,
            ENTITY_SELECTOR: '.saucy-el',
            ACTIVE_CLASS: 'saucy-active',
            INVERT_BEHAVIOUR: false,
            TRIGGER_POS: 'top'
        };

        // Checking if the passed 'options' param is an object. If its not then set it to the defaults.
        if (options instanceof Object || !(options instanceof Array)) {
            options.DEBUG = options.DEBUG ? options.DEBUG : defaults.DEBUG;
            options.TRIGGER_LINE_POS = options.TRIGGER_LINE_POS ? options.TRIGGER_LINE_POS : defaults.TRIGGER_LINE_POS;
            options.ENTITY_SELECTOR = options.ENTITY_SELECTOR ? options.ENTITY_SELECTOR : defaults.ENTITY_SELECTOR;
            options.ACTIVE_CLASS = options.ACTIVE_CLASS ? options.ACTIVE_CLASS : defaults.ACTIVE_CLASS;
            options.INVERT_BEHAVIOUR = options.INVERT_BEHAVIOUR ? options.INVERT_BEHAVIOUR : defaults.INVERT_BEHAVIOUR;
            options.TRIGGER_POS = options.TRIGGER_POS ? options.TRIGGER_POS : defaults.TRIGGER_POS;
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

    // Get the triggered (top, bottom, center) edge positions of the entities on the page.


    _createClass(SaucyJack, [{
        key: '_updateEntities',
        value: function _updateEntities() {
            var triggerPos = this.options.TRIGGER_POS;

            this._entities.forEach(function (ent) {
                var boundingClient = ent.el.getBoundingClientRect();

                if (triggerPos === 'center') {
                    ent.yTop = boundingClient.top + boundingClient.height / 2;
                } else {
                    ent.yTop = boundingClient[triggerPos];
                }

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
            if (typeof isActive !== 'boolean') {
                isActive = true;
            }
            if (ent.active === isActive) {
                return;
            }

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
            if (this.options.DEBUG) {
                this._updateDebugEl();
            }
        }

        // Callback for the resize event. Iterates the entities and add/removes the 'active'
        // status if they've gone over the trigger line.

    }, {
        key: '_onScroll',
        value: function _onScroll() {
            this._getScrollPos();
            this._updateEntities();
            if (this.options.DEBUG) {
                this._updateDebugEl();
            }
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
    }]);

    return SaucyJack;
}();


},{}],2:[function(require,module,exports){
var SaucyJack = require('../../../dist/build.js');

var saucyJack = new SaucyJack.SaucyJack({DEBUG: true});
},{"../../../dist/build.js":1}]},{},[2]);
