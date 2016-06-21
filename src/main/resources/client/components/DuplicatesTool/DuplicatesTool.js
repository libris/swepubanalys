'use strict';

//Vendor
var marked = require('marked');
// Components
var DuplicatesList = require('components/DuplicatesList/DuplicatesList.js');
var AuthenticationUtil = require('utils/AuthenticationUtil/AuthenticationUtil.js');
var MatchWeightHelp = require('components/Helps/MatchWeightHelp/MatchWeightHelp.js');
var MailExport = require('components/MailExport/MailExport.js');
var _assign = require('lodash/object/assign');
// Mixins
var AuthenticationMixin = require('mixins/AuthenticationMixin/AuthenticationMixin.js');
// CSS modules
var styles = _assign(
    require('./DuplicatesTool.css'),
	require('css/modules/Colors.less')	
);

/**
 * Ambiguities Tool Component
 */
var DuplicatesTool = {
	mixins: [AuthenticationMixin],
	props: ['formModel', 'fields', 'onResultReceived'],
	template: require('./DuplicatesTool.html'),
	data: function() {
		return {
			query: '',
			_styles: styles,
			about: ''
		}
	},
	components: {
		'duplicates-list': DuplicatesList,
		'match-weight-help': MatchWeightHelp,
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
		},
	}

};

module.exports = DuplicatesTool;
