'use strict';

// Vendor
var $ = require('jquery');
var marked = require('marked');
var moment = require('moment');
moment.locale('sv');

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
      lastIndexDate: '',
      modsVersion: ''
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
        localStorage.setItem('CURRENT_MODS', this.modsVersion);
        localStorage.setItem('CURRENT_FETCH', this.lastIndexDate);
        this.hasNews = false;
      }
    },
    checkForUpdates: function() {
      var userVersion = localStorage.getItem('CURRENT_VERSION');
      var userMods = localStorage.getItem('CURRENT_MODS');
      var userFetch = localStorage.getItem('CURRENT_FETCH');
      this.hasNews = (userVersion && (
        userVersion !== this.latestRelease.tag ||
        userMods !== this.modsVersion ||
        userFetch !== this.lastIndexDate
      ));
    },
    recieveData: function(data) {
      this.modsVersion = data.currentModsVersion;
      this.lastIndexDate = moment(data.lastIndexDate, "YYYY-MM-DDHH:mm:ss").format('LL');
      this.latestRelease = data.releaseInfo.releases[0];
      this.latestRelease.formatted_publish_date = moment(this.latestRelease.published_at, "YYYY-MM-DDTHH:mm:ssZ").format('YYYY-MM-DD');
      this.harvestNotes(this.latestRelease.body);
      this.checkForUpdates();
    },
    harvestNotes: function(markdown) {
      
      // This method takes the markdown provided, converts it to HTML and
      // extracts the items we want.
      var html = $(marked(markdown));
      var changelog = [];
      var newHtml = html.find('h1').text() + '<ul>';
      html.find('li').each(function() {
        changelog.push($(this).text());
      });
      var maxItems = 5;
      for (var item in changelog) {
        if (item < maxItems) {
          newHtml += '<li>' + changelog[item] + '</li>';
        }
      }
      newHtml += '</ul>';
      
      // Add some info on the limited view
      if (changelog.length > maxItems) {
        newHtml += '+ ' + (changelog.length - maxItems);
        if (changelog.length - maxItems == 1) {
          newHtml += ' ändring.';
        } else {
          newHtml += ' ändringar.';
        }
      }
      
      this.latestRelease.formatted_body = newHtml;
    },
    init: function() {
      TechnicalInfoUtil.getTechInfo(function(techinfo) {
        this.recieveData(techinfo);
      }.bind(this));
    }
  }
}

module.exports = TechInfoWindow;
