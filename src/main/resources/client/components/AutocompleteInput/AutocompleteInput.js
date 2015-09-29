'use strict';

// Vendor
var $ = require('jquery');
require('select2/dist/css/select2.css');
require('select2');
require('./AutocompleteInput.css');

/**
 * Autocomplete Input-component
 * @prop {Array} val
 * @prop {Array} options
 */
var AutocompleteInput = {
	props: ['val', 'options', 'optgroups'],
	template: require('./AutocompleteInput.html'),
	/**
	 * Ready-hook appends change listener to input element and updates val prop on change
	 */
	ready: function() {
		this.create();
	},
	watch: {
		/**
		 * On update of options-prop, recreate element
		 */
		'options': function() {
			this.create();
		},
		'optgroups': function() {
			this.create();
		}
	},
	methods: {
		/**
		 * Create select2 autocomplete element. This function may also be called to re-create upon
		 * updated props
		 */
		create: function() {
			var el = this.$el;
			$(el).select2().on('change', function(e) {
	 			this.$set('val', $(el).val());
			}.bind(this));	
		}
	}
};

module.exports = AutocompleteInput;