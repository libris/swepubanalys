'use strict';

// Mixins
var HelpMixin = require('mixins/HelpMixin/HelpMixin.js');

/**
 * match_weight Help-component
 */
var MatchWeightHelp = {
	mixins: [HelpMixin],
	template: require('./MatchWeightHelp.html'),
	ready: function() {
		this.initHelp({
			title: 'VIKTNING',
			content: '',
			anchorToElement: this.$el
		});
	}
};

module.exports = MatchWeightHelp;