'use strict';

/**
 * Time Input-component
 * @prop {String} from
 * @prop {String} to
 */
var TimeInput = {
	props: ['from', 'to'],
	template: require('./TimeInput.html')
};

module.exports = TimeInput;