SaucyJack
=========

What is it?
-----------

SaucyJack is a scroll position detection & triggering module.

Usage
_____

	// require SausyJack module
	var SaucyJack = require('../path/to/saucy-jack.js');

	// Optional options
	var options = {
        DEBUG: false,
        TRIGGER_LINE_POS: 0.85,
        ENTITY_SELECTOR: '.saucy-el',
        ACTIVE_CLASS: 'saucy-active',
        INVERT_BEHAVIOUR: false,
    }

	saucyJack = new SaucyJack.SaucyJack(options);

Methods
_______
	
	saucyJack.addElement(el)

Adds an element that triggers the event when this element enters the trigger zone.

Compiling
_________

Install requirements using the following from the terminal in the project root directory:

	npm install


SaucyJack is build using ES2015. To compile to ES5 compatible code use the following from the :
	
	npm run compile

This will create both a /dist/build.js and /dist/build.min.js file, an un compressed file for development and a minified and uglified version for production.

Example
_______

An example file is available in /example/index.html. To compile the latest version of the module code use: 

	npm run compile-example

To compile /src/saucy-jack.js for both the example and development/production use:

	npm run compile-all

Testing
_______

SaucyJack come with complete unit testing and code coverage. Tests are created in the /tests/spec.js file. To run the test use:

	npm test

This will create a basic report in the terminal showing if any tests have failed and the total code coverage. To view the full coverage report open /tests/test-results/html/index.html