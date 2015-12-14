var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
  config.set({
	basePath: '',
	frameworks: ['jasmine'],
	plugins: [
		require('karma-jasmine'),
		require('karma-phantomjs-launcher'),
		require('karma-chrome-launcher'),
		require('karma-webpack')
	],
	files: [
		'src/main/resources/client/**/*.test.js',
	],
	exclude: [
	],
	preprocessors: {
		'src/main/resources/client/**/*.test.js': ['webpack']
	},
	webpack: webpackConfig,
	reporters: ['progress'],
	port: 9876,
	colors: true,
	logLevel: config.LOG_INFO,
	autoWatch: true,
	browsers: ['Chrome'],
	singleRun: false
  })
}
