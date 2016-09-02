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
var DataUtil = require('utils/DataUtil/DataUtil.js');
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
			about: '',
			totalHits: false
		}
	},
	components: {
		'ambiguities-list': AmbiguitiesList,
		'mail-export': MailExport
	},
	ready: function() {
		this.$set('about', marked(require('docs/research_collaboration.md')));
		this.$watch('formModel', function () {
			this.formModelChanged();
		}.bind(this));
		// Watch for deep mutation of filterFields, regenerate query if this occurs
		this.$watch('filterFields', function () {
			this.filterFieldsChanged();
		}.bind(this), {deep: true});
		// Generate query on ready hook
		this.formModelChanged();
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
		/**
		 * Should be called if props.formModel has been received or updated. Gets appropriate filterFields according
		 * to template name and updates data.filterFields accordingly
		 */
		formModelChanged: function () {
			console.log(JSON.stringify(this.formModel))
			DataUtil.getFilterAggregations(this.formModel, function (aggregations) {
				if (aggregations && typeof aggregations.total_hits !== 'undefined') {
					this.$set('totalHits', aggregations.total_hits);
				} else {
					this.$set('totalHits', false);
				}
			}.bind(this));
		},
		/**
		 * Should be called if data.filterFields has been mutated. This can be triggered either by the user interacting
		 * with the GUI or if formModelChanged(). We subsequently updateQuery(), and let that function decide whether
		 * to do a POST or not
		 */
		filterFieldsChanged: function () {

		}


	}
};

module.exports = AmbiguitiesTool;
