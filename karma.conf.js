module.exports = function (config) {
    config.set({
        basePath: process.cwd(),
        browsers: [
            'PhantomJS'
        ],
        frameworks: [
            'mocha'
        ],
        files: [
            './node_modules/chai/chai.js',
            './lib/type3.js',
            './tests/unit/type3-test.js'
        ],
        preprocessors: {
            './lib/type3.js': ['coverage']
        },
        reporters: [
            'progress',
            'coverage'
        ],
        coverageReporter: {
            dir: 'tmp/coverage',
            reporters: [
                { type: 'html' },
                { type: 'text' }
            ]
        }
    });
};