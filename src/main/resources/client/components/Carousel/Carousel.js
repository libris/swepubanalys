'use strict';

// Vendor
var $ = require('jquery');
window.jQuery = window.$ = $;
require('owl-carousel.js');
require('owl-carousel.css');
var _assign = require('lodash/object/assign');
// CSS modules
var styles = require('!!style!css?modules!./Carousel.css');

/**
 * Carousel component
 */
var Carousel = {
	_t: null, // Timeout reference
	props: ['conf', 'onNavigate'],
	template: require('./Carousel.html'),
	data: function() {
		return {
			instance: undefined, // reference to owlCarousel instance
			_styles: styles
		}
	},
	ready: function() {
		this.init();
		window.addEventListener('resize', function(event) {
			clearTimeout(this._t);
			this._t = setTimeout(function() {
				this.init();
			}.bind(this), 300);
		}.bind(this));
	},
	methods: {
		/**
		 * Initialize the Owl-Carousel
		 */
		init: function() {
			var instance = this.$els.carousel;
			if(instance) {
				var conf = _assign({}, this.conf || {});
				$(instance).owlCarousel(conf);
				this.$set('instance', instance);
				this.triggerNavigate();	
			}
		},
		/**
		 * Goto next slide
		 */
		next: function(e) {
			e.preventDefault();
			this.instance && $(this.instance).trigger('owl.next');
			this.triggerNavigate();
		},
		/**
		 * Goto previous slide
		 */
		prev: function(e) {
			e.preventDefault();
			this.instance && $(this.instance).trigger('owl.prev');
			this.triggerNavigate();
		},
		/**
		 * Trigger navigate. This is used to let carousel data bubble up to parent components
		 */
		triggerNavigate: function() {
			if(this.onNavigate) {
				var data = $(this.instance).data('owlCarousel');
				// Finish current stack before callback
				setTimeout(function() {
					this.onNavigate({
						visibleItems: data.visibleItems
					});	
				}.bind(this));
			}
		}
	}
};

module.exports = Carousel;