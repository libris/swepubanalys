'use strict';

// Vendor
var $ = require('jquery');
var Mustache = require('mustache');
// Components
var HelpInitiatorButton = require('components/HelpInitiatorButton/HelpInitiatorButton.js');
// We need bootstrap js for the popover, and therefore window.jQuery...
window.jQuery = $;
require('bootstrap/dist/js/bootstrap.min.js');


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
  ready: function() {
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
      window.addEventListener('resize', function(){
        this.hidePopover(conf.anchorToElement);
      }.bind(this), true);
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
      var marginLeft = conf.marginLeft || '15px';
      var marginTop = conf.marginTop || '0px';
      var marginBottom = conf.marginBottom || '0px';
      // Create popover
            conf.content = conf.content || '';
      $(conf.anchorToElement).popover({
        trigger: 'manual',
        placement: conf.placement || 'right',
                title: conf.title,
         template: Mustache.render(require('./Template.html'), { marginLeft: marginLeft, marginTop: marginTop, marginBottom: marginBottom }),
                content: Mustache.render(require('./Content.html'), conf),
        html: true,
      });
            /**
       * Handle show/hide manually
       */
      $(document).on('click', function(e) {
        console.log("Registered click event for help popover");
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
