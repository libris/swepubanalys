'use strict';

// Vendor
var $ = require('jquery');
window.jQuery = $;
require('bootstrap/dist/js/bootstrap.min.js');
// Components
var HelpInitiatorButton = require('components/HelpInitiatorButton/HelpInitiatorButton.js');

/**
 * Mixin used to append a Help-popover to an element. Just call initHelp({ ... }) from ready-hook.
 * 
 * Which element should the popover anchor to? Provide one explicitly, otherwise this mixin chooses the component root-node
 * 
 * Which element should trigger the popover to show? Provide one explicitly, otherwise the mixin chooses an element using
 * the className 'helpInitiator' or component root-node
 */
var HelpMixin = {
	components: {
		'help-initiator-button': HelpInitiatorButton
	},
	methods: {
		/**
		 * Initiates the help-popover
		 * @param {Object} conf
		 */
		initHelp: function(conf) {
			var el = this.$el;
			conf.initiatorElement = conf.initiatorElement || (el.getElementsByClassName('helpInitiator')[0] || el);
			conf.anchorToElement = conf.anchorToElement || el;
			this.createPopover(conf);
		},
		/**
		 * Creates a popover given an initiatorElement and anchorToElement
		 * @param {Object} conf
		 */
		createPopover: function(conf) {
			if(!conf.initiatorElement || !conf.anchorToElement) {
				console.error('*** HelpMixin.js: initiatorElement and anchorToElement args not provided');
				return false;
			}
			var marginLeft = conf.marginLeft || '0px';
			var marginTop = conf.marginTop || '0px';
			// Create popover
			$(conf.anchorToElement).popover({
				trigger: 'manual',
				placement: conf.placement || 'right',
				template: '<div class="popover" style="margin-left: ' + marginLeft + '; margin-top: ' + marginTop + '"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
				title: conf.title,
				content: '<div style="max-height: 550px; overflow-y: auto; overflow-x: hidden">' + conf.content || ''  + '</div>',
				html: true,
				container: 'body',
			});
			/**
			 * Handle show/hide manually
			 */
			$(document).on('click', function(e) {
				var initiatorElement = conf.initiatorElement;
				var anchorToElement = conf.anchorToElement;
				// If click on, or inside of, initiatorElement
				if(initiatorElement === e.target || $.contains(initiatorElement, e.target)) {
					// Show popover if not visible
					if(!$(anchorToElement).data('popoverVisible')) {
						$(anchorToElement).popover('show');
						$(anchorToElement).data('popoverVisible', true);
					}
				}
				// If click on, or inside of, anchorToElement
				else if((anchorToElement === e.target || $.contains(anchorToElement, e.target)) && $(anchorToElement).data('popoverVisible') === true) {
					// Do nothing
				}
				// Else hide popover
				else {
					$(anchorToElement).popover('hide');
					$(anchorToElement).data('popoverVisible', false);
				}
			}.bind(this));
		},
		/**
		 * Hides the popover of a given anchorToElement
		 */
		hidePopover: function(el) {
			$(el).popover('hide');
			$(el).data('popoverVisible', false);
		}
	}
};

module.exports = HelpMixin;