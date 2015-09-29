'use strict';

// Vendor
var $ = require('jquery');
window.jQuery = $;
require('bootstrap/dist/js/bootstrap.min.js');

/**
 * Mixin for creating Help-popovers. Just call initHelp({ ... }) from 
 * the ready() hook of any component
 */
var HelpMixin = {
	methods: {
		/**
		 * Initialise Help popover
		 * @param {Object} conf
		 */
		initHelp: function(conf) {
			var el = $(this.$el);
			// Create popover
			$(el).popover({
				trigger: 'manual',
				placement: 'right',
				template: '<div class="popover" style="margin-left: 15px; margin-top: 15px;"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
				title: conf.title,
				content: '<div style="max-height: 350px; overflow-y: auto">' + conf.content || ''  + '</div>',
				html: true,
				container: 'body',
			});
			// If user clicks...
			$(document).on('click', function(e) {
				// ...on an element which is not contained within this.$el...
				if(!($.contains(this.$el, e.target))) {
					$(el).popover('hide');
					$(el).data('popoverVisible', false);
				}
				else if(!$(el).data('popoverVisible')) {
					$(el).popover('toggle');
					$(el).data('popoverVisible', true);
				}
			}.bind(this));
		}
	}
};

module.exports = HelpMixin;