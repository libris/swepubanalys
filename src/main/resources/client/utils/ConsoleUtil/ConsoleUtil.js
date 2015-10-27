'use strict';

// Since we want to use the console, avoid causing errors in browsers which lack the console object.
// Using the console can cause errors in browsers such as IE9, where the console object is not
// intantiated until the Developer Tools are opened.
if(!window.console) {
	window.console = {
		log: function() { }
	}
}
if(!window.console.error) {
	window.console.error = function() { };
}
if(!window.console.warning) {
	window.console.warning = function() { };
}