'use strict';

// Vendor
var Vue = require('vue');
var $ = require('jquery');
window.jQuery = window.$ = $;
require('owl-carousel.js');
require('owl-carousel.css');
var _assign = require('lodash/object/assign');
// CSS modules
var styles = require('./Carousel.css');

/**
 * Carousel component
 */
var Carousel = {
	_t: null, // Timeout reference
	props: ['conf', 'onNavigate'],
	template: require('./Carousel.html'),
	data: function() {
		return {
			instance: undefined, // Reference to owlCarousel instance
			instanceData: { // Reference to owlCarousel instance data
				length: 0,
				visibleItems: []
			},  
			_styles: styles,
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
				conf.afterMove = this.triggerNavigate;
				$(instance).owlCarousel(conf);
				this.$set('instance', instance);
				this.triggerNavigate();	
			}
		},
		/**
		 * Goto next slide
		 */
		next: function() {
			this.instance && $(this.instance).trigger('owl.next');
		},
		/**
		 * Goto previous slide
		 */
		prev: function() {
			this.instance && $(this.instance).trigger('owl.prev');
		},
		/**
		 * Go to a slide
		 * @prop {Number} i
		 */
		goto: function(i) {
			this.instance && $(this.instance).trigger('owl.goTo', i);
		},
		/**
		 * Trigger navigate. This is used to let carousel data bubble up to parent components
		 */
		triggerNavigate: function() {
			var data = $(this.instance).data('owlCarousel');
			this.$set('instanceData', {
				length: data.itemsAmount,
				visibleItems: data.visibleItems
			});
			if(this.onNavigate) {
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

/**
 * Filter on an index "n" being present in visibleItems
 * @prop {Number} n
 * @prop {Array} visibleItems
 */ 
Vue.filter('carousel-visible-item', function(n, visibleItems) {
	var visible = visibleItems.filter(function(item) {
		return n === item;
	});
	return visible.length === 1;
});

/**
 * Filter on an index "n" not being present in visibleItems
 * @prop {Number} n
 * @prop {Array} visibleItems
 */
Vue.filter('carousel-invisible-item', function(n, visibleItems) {
	var visible = visibleItems.filter(function(item) {
		return n === item;
	});
	return visible.length !== 1;
});

module.exports = Carousel;