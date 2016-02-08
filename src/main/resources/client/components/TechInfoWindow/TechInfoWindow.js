'use strict';

// Vendor
var $ = require('jquery');

// Utils
var TechnicalInfoUtil = require('utils/TechnicalInfoUtil/TechnicalInfoUtil.js');

// CSS modules
var styles = require('./TechInfoWindow.css');

var TechInfoWindow = {
  template: require('./TechInfoWindow.html'),
  props: [
    'trigger',
    'content',
    'info'
  ],
  data: function() {
    return {
      show: false,
      hasNews: false,
      _styles: styles,
      latestRelease: {},
    }
  },
  ready: function() {
    this.init();
  },
  methods: {
    toggle: function() {
      this.show = !this.show;
      
      if (this.hasNews && this.show) {
        localStorage.setItem('CURRENT_VERSION', this.latestRelease.tag);
        this.hasNews = false;
      }
    },
    checkVersion: function() {
      console.log(JSON.stringify(this.latestRelease));
      if (localStorage.getItem('CURRENT_VERSION') !== this.latestRelease.tag) {
        this.hasNews = true;
      } else {
        this.hasNews = false;
      }
    },
    init: function() {

      TechnicalInfoUtil.getTechInfo(function(techinfo) {
        // thisVar.$set('latestRelease', techinfo.releaseInfo.releases[0].tag);
        this.$set('latestRelease', techinfo.releaseInfo.releases[0]);
        this.checkVersion();
      }.bind(this));
    }
  }
}

module.exports = TechInfoWindow;
