'use strict';

/**
 * Publication Status Input-component
 * @prop {Array} PublStatus
 */
var PublStatusInput = {
	props: ['publStatus'],
	template: require('./PublStatusInput.html'),
	ready: function() {
		console.log(this.publStatus);
	}
};

module.exports = PublStatusInput;