'use strict';

var outputDir = './tests/test-results/';

module.exports = function(config) {
    config.set({
        browsers: [ 'PhantomJS' ], //run in Chrome

        files: [
            './tests/spec.js'
        ],

        frameworks: ['mocha', 'chai', 'sinon'],

        preprocessors: {
            './tests/spec.js': [ 'webpack' ]
        },

        reporters: [ 'progress', 'coverage' ], //report results in this format

        coverageReporter: {
            dir: outputDir,
            reporters: [{
                type: 'html',
                subdir: 'html'
            },{
                type: 'text-summary'
            }]
        },

        singleRun: true, //just run once by default

        webpack: {
            node : {
                fs: 'empty'
            },

            // Instrument code that isn't test or vendor code.
            module: {
                preLoaders: [{ 
                    // test: /\.js$/,
                    // include: path.join(__dirname, 'src/js'),
                    loader: 'isparta'
                }],
                loaders: [{
                    // test: /\.js$/,
                    // include: path.join(__dirname, 'src/js'),
                    loader: 'babel?presets=es2015'
                }]
            }
        },

        webpackMiddleware: {
            noInfo: true //please don't spam the console when running in karma!
        }
    });
};