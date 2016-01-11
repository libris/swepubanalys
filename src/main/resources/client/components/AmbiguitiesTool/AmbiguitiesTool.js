'use strict';

// Components
var AmbiguitiesList = require('components/AmbiguitiesList/AmbiguitiesList.js');
var MailExport = require('components/MailExport/MailExport.js');
var _assign = require('lodash/object/assign');
// Mixins
var AuthenticationMixin = require('mixins/AuthenticationMixin/AuthenticationMixin.js');
// CSS modules
var styles = _assign(
    require('./AmbiguitiesTool.css'),
	require('css/modules/Colors.less')	
);

/**
 * Ambiguities Tool Component
 */
var AmbiguitiesTool = {
	mixins: [AuthenticationMixin],
	props: ['formModel', 'fields', 'onResultReceived'],
	template: require('./AmbiguitiesTool.html'),
	data: function() {
		return {
			query: '',
			_styles: styles
		}
	},
	components: {
		'ambiguities-list': AmbiguitiesList,
		'mail-export': MailExport
	},
	methods: {
		/**
		 * Sent as a callback to <ambiguities-list> in order to get the generated query used in <mail-export>
		 * @param {String} query
		 */
		onGenerateQuery: function(query) {
			this.$set('query', query);
		}
	}
};

module.exports = AmbiguitiesTool;