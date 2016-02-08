'use strict';

// Vendor
var $ = require('jquery');
var moment = require('moment');

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
      if (this.show) {
        localStorage.setItem('CURRENT_VERSION', this.latestRelease.tag);
        this.hasNews = false;
      }
    },
    checkVersion: function() {
      var userVersion = localStorage.getItem('CURRENT_VERSION');
      this.hasNews = (userVersion && userVersion !== this.latestRelease.tag);
    },
    recieveData: function(data) {
      this.latestRelease = data;
      this.latestRelease.formatted_publish_date = moment(this.latestRelease.published_at, "YYYY-MM-DDTHH:mm:ssZ").format('YYYY MM DD');
      this.checkVersion();
    },
    init: function() {
      TechnicalInfoUtil.getTechInfo(function(techinfo) {        
        this.recieveData(techinfo.releaseInfo.releases[0]);
      }.bind(this));
    }
  }
}

module.exports = TechInfoWindow;
