'use strict';

// Vendor
var $ = require('jquery');
require('select2');
// CSS
require('select2/dist/css/select2.css');
require('./AutocompleteInput.css');

/**
 * Autocomplete Input-component
 * @prop {Array} val
 * @prop {Array} options
 */
var AutocompleteInput = {
	props: ['val', 'options', 'optgroups'],
	template: require('./AutocompleteInput.html'),
	data: function() {
		return { 
			selected: '' 
		};
	},
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
	},
	methods: {
		/**
		 * Clears the value
		 */
		clear: function() {
			var el = this.$el;
			$(el).select2('val', '');
		},
		/**
		 * Create select2 autocomplete element. This function may also be called to re-create upon
		 * updated props
		 */
		create: function() {
			var el = this.$el;
			$(el).select2().on('change', function(e) {
	 			this.$set('val', $(el).select2('data').map(function(d) { return { value: d.id, text: d.text } }));
			}.bind(this));	
		}
	}
};

module.exports = AutocompleteInput;