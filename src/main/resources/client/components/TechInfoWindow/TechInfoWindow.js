'use strict';

var $ = require('jquery');

var TechInfoWindow = {
  template: require('./TechInfoWindow.html'),
  props: [
    'trigger',
    'content'
  ],
  data: function() {
    return {
      show: false
    }
  },
  methods: {
    toggle: function() {
      this.show = !this.show;
    }
  }
}

module.exports = TechInfoWindow;
