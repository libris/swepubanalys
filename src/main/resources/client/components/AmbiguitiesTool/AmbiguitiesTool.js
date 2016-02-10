'use strict';
//Vendor
var marked = require('marked');
// Components
var AmbiguitiesList = require('components/AmbiguitiesList/AmbiguitiesList.js');
var SearchForm = require('components/SearchForm/SearchForm.js');
var MailExport = require('components/MailExport/MailExport.js');
var _assign = require('lodash/object/assign');
// Mixins
var AuthenticationMixin = require('mixins/AuthenticationMixin/AuthenticationMixin.js');
//Utility
var FormFieldMemoryUtil = require('utils/FormFieldMemoryUtil/FormFieldMemoryUtil.js');
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
			_styles: styles,
			about: ''
		}
	},
	components: {
		'ambiguities-list': AmbiguitiesList,
		'mail-export': MailExport
	},
	ready: function() {
		this.$set('about', marked(require('docs/research_collaboration.md')));
	},
	methods: {
		/**
		 * Sent as a callback to <ambiguities-list> in order to get the generated query used in <mail-export>
		 * @param {String} query
		 */
		onGenerateQuery: function(query) {
			this.$set('query', query);
		},
		onClickExternal: function() {
			localStorage.setItem('externalPass', true);
		}
	}
};

module.exports = AmbiguitiesTool;