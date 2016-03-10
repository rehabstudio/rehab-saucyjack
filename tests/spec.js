'use strict';

var SaucyJack = require('../src/saucy-jack.js');

describe('SaucyJack class', function() {

	var saucyJack;

	beforeEach(function() {
		saucyJack = new SaucyJack.SaucyJack();
	})

	it('should have default values for options', function() {

		expect(saucyJack.options.DEBUG).to.equal(false);
		expect(saucyJack.options.TRIGGER_LINE_POS).to.equal(0.85);
		expect(saucyJack.options.ENTITY_SELECTOR).to.equal('.saucy-el');
		expect(saucyJack.options.ACTIVE_CLASS).to.equal('saucy-active');
		expect(saucyJack.options.INVERT_BEHAVIOUR).to.equal(false);
	});

	it('should use default values if wrong type of object is supplied to constructor', function() {
		var saucierJack = new SaucyJack.SaucyJack('string');

		expect(saucierJack.options.DEBUG).to.equal(false);
		expect(saucierJack.options.TRIGGER_LINE_POS).to.equal(0.85);
		expect(saucierJack.options.ENTITY_SELECTOR).to.equal('.saucy-el');
		expect(saucierJack.options.ACTIVE_CLASS).to.equal('saucy-active');
		expect(saucierJack.options.INVERT_BEHAVIOUR).to.equal(false);
	});

	it('should use custom values if they are supplied to constructor', function() {
		var saucierJack = new SaucyJack.SaucyJack({
			DEBUG: true,
			TRIGGER_LINE_POS: 0.6,
			ENTITY_SELECTOR: '.dirty-frank-el',
			ACTIVE_CLASS: 'saucier-active',
			INVERT_BEHAVIOUR: true
		});

		expect(saucierJack.options.DEBUG).to.equal(true);
		expect(saucierJack.options.TRIGGER_LINE_POS).to.equal(0.6);
		expect(saucierJack.options.ENTITY_SELECTOR).to.equal('.dirty-frank-el');
		expect(saucierJack.options.ACTIVE_CLASS).to.equal('saucier-active');
		expect(saucierJack.options.INVERT_BEHAVIOUR).to.equal(true);
	});

	it('should create a debug element if options.DEBUG is true', function() {

		var saucierJack = new SaucyJack.SaucyJack({DEBUG: true});

		expect(saucierJack.options.DEBUG).to.equal(true);
		expect(saucierJack._debugEl.nodeName).to.equal('DIV');

	});

	it('should add elements to the \'_entities\' array using the addElement function', function() {
		var saucyJack = new SaucyJack.SaucyJack();

		var entity = document.createElement('div');
		entity.classList.add('.saucy-el');

		saucyJack.addElement(entity);

		expect(saucyJack._entities.length).to.equal(1);
	});


	it('should find and add elements to the \'_entities\' array from the document body', function() {

		var entity = document.createElement('div');
		entity.classList.add('saucy-el');

		document.body.appendChild(entity)

		var saucierJack = new SaucyJack.SaucyJack('string');

		expect(saucierJack._entities.length).to.equal(1);
	});

	it('should call _updateTriggerLine and _updateEntities function after resize event is triggered', function() {

		var _updateTriggerLineSpy = sinon.spy(saucyJack, '_updateTriggerLine');
		var _updateEntitiesSpy = sinon.spy(saucyJack, '_updateEntities');

		window.dispatchEvent(new Event('resize'));

		expect(_updateTriggerLineSpy.calledOnce).to.equal(true);
		expect(_updateEntitiesSpy.called).to.equal(true);

		saucyJack._updateTriggerLine.restore();
		saucyJack._updateEntities.restore();


	});

	it('should call _updateTriggerLine and _updateEntities function after resize event is triggered', function() {

		var _getScrollPosSpy = sinon.spy(saucyJack, '_getScrollPos');
		var _updateEntitiesSpy = sinon.spy(saucyJack, '_updateEntities');

		window.dispatchEvent(new Event('scroll'));

		expect(_getScrollPosSpy.calledOnce).to.equal(true);
		expect(_updateEntitiesSpy.called).to.equal(true);

		saucyJack._getScrollPos.restore();
		saucyJack._updateEntities.restore();

	});

	it('should add/remove the class on an entity element using the _setActiveStatus function', function() {
		var entity = document.createElement('div');
		saucyJack.addElement(entity);

		saucyJack._setActiveStatus({el: entity}, true);

		expect(entity.classList.contains('saucy-active')).to.equal(true);

		saucyJack._setActiveStatus({el: entity}, false);

		expect(entity.classList.contains('saucy-active')).to.equal(false);
	});

	it('_setActiveStatus function should work even if \'isActive\' is not of type Boolean', function() {

		var entity = document.createElement('div');
		saucyJack.addElement(entity);

		saucyJack._setActiveStatus({el: entity}, undefined);

		expect(entity.classList.contains('saucy-active')).to.equal(true);

	});

});