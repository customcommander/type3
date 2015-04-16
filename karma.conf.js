module.exports = function (config) {

    var sauceBrowsers = {

        sauceFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 7'
        },

        sauceChrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7'
        },

        sauceInternetExplorer: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '10.0'
        }
    };

    /**
     * Return `local` or `ci` depending on which environment Karma is running.
     *
     * @param local {Any} Use this if running locally
     * @param ci {Any} Use this if running on a CI server
     * @return {Any} Either `local` or `ci`.
     */
    function ifLocal(local, ci) {
        return !process.env.TRAVIS ? local : ci;
    }

    config.set({

        port: 9876,

        basePath: '',

        autoWatch: false,

        frameworks: [
            'mocha'
        ],

        files: [
            { pattern: './node_modules/mocha/mocha.js', watched: false },
            { pattern: './node_modules/chai/chai.js'  , watched: false },
            { pattern: './src/js/type3.js'   },
            { pattern: './src/test/type3.js' }
        ],

        preprocessors: {
            'src/js/type3.js': ['coverage']
        },

        customLaunchers: sauceBrowsers,

        browsers: ifLocal(
            ['PhantomJS'],
            Object.keys(sauceBrowsers)),

        reporters:
            ['coverage'].concat(ifLocal(
                ['mocha'],
                ['saucelabs'])),

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                { type: 'html' },
                { type: 'text' }
            ]
        },

        plugins:
            ['karma-mocha',
             'karma-coverage'].concat(ifLocal(
                ['karma-mocha-reporter',
                 'karma-phantomjs-launcher'],
                ['karma-sauce-launcher'])),

        singleRun: true
    });
};
