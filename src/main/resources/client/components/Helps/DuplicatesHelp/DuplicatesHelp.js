'use strict';

// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');

/**
 * Duplicates Help-component
 */
var DuplicatesHelp = {
	mixins: [HelpMixin],
	template: require('./DuplicatesHelp.html'),
	ready: function() {
		this.initHelp({
			title: 'DUBBLETTKANDIDATER',
			content: require('docs/duplicates.md'),
			anchorToElement: this.$el
		});
	}
};

module.exports = DuplicatesHelp;