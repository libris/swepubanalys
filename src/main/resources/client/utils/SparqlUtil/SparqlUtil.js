'use strict';

// Vendor
var jQuery = require('jquery');
var $ = jQuery;

/**
 * SPARQL Utilities
 */
var SparqlUtil = {
	apiUrl: '/api/1.0/sparql',
	ambiguityCaseUrl: 'api/2.0/ambiguity/case',
	sendFileToEmailUrl: '/api/2.0/data/query',
	getFileUrl: 'http://virhp07.libris.kb.se/sparql',
	/**
	 * Request that a file should be sent to an e-mail address
	 * @param {String} email
	 * @param {String} format
	 * @param {Boolean} zipped
	 * @param {String} query
	 * @param {Function} callback 
	 */
	sendFileToEmail: function(email, format, zipped, query, callback) {
		$.ajax({
			url: this.sendFileToEmailUrl,
			type: 'POST',
			data: {
				email: email,
				format: format,
				zip: true,
				query: query
			},
		})
	},
	/**
	 * Fetch an ambiguity case from server
	 * @param {String} record1
	 * @param {String} record2
	 * @param {Function} callback
	 */
    getAmbiguityCase: function(org1, record1, org2, record2, callback) {
		console.log(org1, record1, org2, record2);
		$.ajax({
			url: this.ambiguityCaseUrl,
			type: 'GET',
			data: {
				record1_org: org1,
				record1_id: record1,
				record2_org: org2,
				record2_id: record2,
			},
			success: function(response) {
				callback(response);
			},
			error: function(response) {
				callback({ error: response });
			}
		});
    },
	/**
	 * Generates a SPARQL Query
     *
     * @param {Object} conf
     * @param {function} callback
     *
     * conf has following params:
     * @param {Object} formModel
     * @param {Boolean} limit
     * @param {String} filter ('all', 'none')
	 */
	generateQuery: function(conf, callback) {
		var formModel = conf.formModel;
		// Has a formModel been provided?
		if(!formModel) {
			console.error('*** SparqlUtil.generateQuery: conf.formModel not provided');
			return false; 
		}
		// Has a valid templateName been provided?
		if(!formModel.templateName || !Templates[formModel.templateName]) {
			console.error('*** SparqlUtil.generateQuery: Incorrect templateName');
			return false;
		}
		// Does the template exist?
		if(!Templates[formModel.templateName].template) {
			console.error('*** SparqlUtil.generateQuery: Template for ' + formModel.templateName + ' does not exist');
			return false;
		}
		// Are filterFields provided?
		var query = Templates[formModel.templateName].template;
		if(!formModel.filterFields || formModel.filterFields.length <= 0) {
			console.error('*** SparqlUtil.generateQuery: conf.formModel.filterFields is not provided');
			return false;
		}
    	var checked, unchecked, res, re;    	
    	var filterFields 	= formModel.filterFields;
		var limit 			= conf.limit || false;
	    var org 			= formModel.org || '';
    	var from 			= formModel.from || '';
    	var to 				= formModel.to || '';
    	var openaccess 		= formModel.openaccess;
    	var publtype 		= formModel.publtype;
    	var subject 		= formModel.subject || '';
    	var status 			= formModel.status || 'all';
    	var errortype 		= '';
    	var author 			= formModel.author || '';
    	var orcid 			= formModel.orcid || '';
    	var checked_string 	= '';
    	var options_string 	= '';
    	var filters_string 	= '';
    	var regex_string 	= '';
		
    	var re_select = /((?:prefix.[\S\s]*?)?select\s*(?:distinct)?\s*)[\S\s]*?(where[\S\s]*?)(###\s*FILTERS\s+[\S\s]*)/i
        res = re_select.exec(query);

        if (res !== null) {
            query = res[1];
            options_string = res[2];
            filters_string = res[3] || '';
            for(var i = 0; i < filterFields.length; i++) {
            	var key = filterFields[i].field;
            	var checked = filterFields[i].checked;
            	if(!(conf.filter && conf.filter === 'all') && (checked === true || conf.filter === 'none')) {
                	checked_string += key + '\n';
                } else if(key === '?_hsv3' && subject.length > 0) {
					// Do nothing
				} else {
					regex_string = "#START_<\\" + key + ">[^]*?#END_<\\" + key + ">.*?";
					re = new RegExp(regex_string , 'i');
					options_string = options_string.replace(re, '');
                }
            }
            if(filters_string) {
                if(org) {
                    if(formModel.templateName === 'duplicates') {
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode1>(.*?)<\?_orgCode1>(.*)$/mi, "$1$2" + qs(org) + "$3");
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode2>(.*?)<\?_orgCode2>(.*)$/mi, "$1$2" + qs(org) + "$3");
                    } else if(formModel.templateName === 'AmbiguityListing') {
						filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode1>(.*?)<\?_orgCode1>(.*)$/mi, "$1$2" + qs(org) + "$3");
					} else {
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode>(.*?)<\?_orgCode>(.*)$/mi, "$1$2" + qs(org) + "$3");
                    }
                }
                if(from) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_pubYear_low>(.*?)<\?_pubYear_low>(.*)$/mi, "$1$2" + from + "$3");
                }
                if(to) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_pubYear_high>(.*?)<\?_pubYear_high>(.*)$/mi, "$1$2" + to + "$3");
                }
                if(publtype) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_publicatType>(.*?)<\?_publicatType>(.*)$/mi, "$1$2" + qs(publtype) + "$3");
                }
                if(openaccess) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_OA>(.*)$/mi, "$1$2");
                }
                if(errortype) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_violationType>(.*?)<\?_violationType>(.*)$/mi, "$1$2" + errortype + "$3");
                }
                if(subject) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_hsv3>(.*?)<\?_hsv3>(.*)$/mi, "$1$2" + subject + "$3");
                }
                if(status) {
                    if (status !== 'all') {
                        filters_string = filters_string.replace(/#(FILTER)_<\?_isPublished>(.*?)<\?_isPublished>(.*)$/mi, "$1$2" + (status==='published'?"1":"0") + "$3");
                    }
                }
                if(formModel.templateName === 'QfBibliometrics' || formModel.templateName === 'simple') {
                    if ( author && orcid ) {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_NAME_FILTER>[^]*?#END_<ONE_CREATOR_NAME_FILTER>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_ORCID_FILTER>[^]*?#END_<ONE_CREATOR_ORCID_FILTER>.*?/, '');
                        author = "'" + author.split(/\s+/).map(function(v){return "\"" + v + "\"";}).join(' AND ') + "'"
                        filters_string = filters_string.replace(/#(FILTER)_<\?_name>(.*?)<\?_name>(.*?)$/mi, "$1$2" + author + "$3" );
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orcid>(.*?)<\?_orcid>(.*)$/mi, "$1$2" + "\"" + orcid + "\"" + "$3");
                    }
                    else if ( author ) {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_TWO_FILTERS>[^]*?#END_<ONE_CREATOR_TWO_FILTERS>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_ORCID_FILTER>[^]*?#END_<ONE_CREATOR_ORCID_FILTER>.*?/, '');
                        author = "'" + author.split(/\s+/).map(function(v){return "\"" + v + "\"";}).join(' AND ') + "'"
                        filters_string = filters_string.replace(/#(FILTER)_<\?_name>(.*?)<\?_name>(.*)$/mi, "$1$2" + author + "$3");
                    }
                    else if ( orcid ) {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_TWO_FILTERS>[^]*?#END_<ONE_CREATOR_TWO_FILTERS>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_NAME_FILTER>[^]*?#END_<ONE_CREATOR_NAME_FILTER>.*?/, '');
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orcid>(.*?)<\?_orcid>(.*)$/mi, "$1$2" + "\"" + orcid + "\"" + "$3");
                    }
                    else {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_TWO_FILTERS>[^]*?#END_<ONE_CREATOR_TWO_FILTERS>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_NAME_FILTER>[^]*?#END_<ONE_CREATOR_NAME_FILTER>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_ORCID_FILTER>[^]*?#END_<ONE_CREATOR_ORCID_FILTER>.*?/, '');

                    }
                }
            }
            if(!limit) {
                filters_string = filters_string.replace(/LIMIT\s+\d+\s*\n}\s*\n}\s*\n\s*LIMIT\s+\d+/i, 'LIMIT 10000000\n}\n}');
            }
            query += checked_string + options_string + filters_string;
            query = query.replace(/^\s*#.*$/gm, '');
            query = query.replace(/^\s*[\n\r\cM]*$/gm, '');
        }
        else {
            console.error('*** SparqlUtil.generateQuery: Could not generate query');
			return false;
        }
		callback(query);
	},
	/**
	 * Returns available fields to filter on
	 * @param {String} templateName
	 */
	getFilterFields: function(templateName) {
		if(!Templates[templateName]) {
			console.warning('*** SparqlUtil.getFilterFields: Incorrect templateName');
			return false;
		}
		var query = Templates[templateName].template;
		var re = /[\S\s]*?select\s*(?:distinct)?\s*([\S\s]*?)where/i;
		var parent = undefined;
		var key = '';
		var name = '';
		var checked = '';
		var node = '';
		var key_name = undefined;
		var col_key_name = undefined;
		var res;
		var ic = 0;
		query = query.replace(/\r/g, '');
		res = re.exec(query);
		var filterFields = [];
		if (res !== null) {
			col_key_name = res[1].split('\n');
			for (var i=0, l=col_key_name.length; i<l; i++) {
				if (col_key_name[i].search(/^\s*$/) > -1) {
					continue; 
				}
				key_name = col_key_name[i].split(/\s*#\s*/);
				key_name[1] = key_name[1] || key_name[0].charAt(2).toUpperCase() + key_name[0].slice(3);
				key_name[2] = key_name[2] || '';
				checked = (key_name[2] === '-') ? false : true; // #- is unchecked in template
				filterFields.push({ 
					field: key_name[0], 
					fieldName: key_name[1],
					checked: checked
				});
			}
		}
		return filterFields;
	},
    /**
     * Posts a query to server
	 * @param {String} query
	 * @param {Function} callback
     */
	postQuery: function(query, callback) {
		if(query) {
			jQuery.ajax({
				url: this.apiUrl,
				type: 'POST',
				data: { 
					query: query, 
					format: 'application/json' 
				},
				statusCode: {
					400: function(response) {
						callback({ error: response });
					}
				},
				success: function(response) {
					callback(response);
				},
				error: function(response) { 
					callback({ error: response });
				}
			});
		}
	},
	/**
	 * Combines query and fileFormat to construct and open a request for a file
	 * @param {String} query
	 * @param {String} fileFormat
	 * @param {Function} callback
	 */
	getFile: function(query, fileFormat, callback) {
		var url = this.getFileUrl;
		if(fileFormat === 'text/csv' || fileFormat === 'text/tab-separated-values' || fileFormat === 'application/json' || fileFormat === 'application/xml') {
			var form = $('<form action="' + url +'" method="post" target="__newtab__12" style="display: none;"><textarea name="query">' + query + '</textarea><input name="format" value="' + fileFormat + '"</input></form>');
			$('body').append(form);
			form.submit();
			callback({
				query: query,
				fileFormat: fileFormat,
			});
		}
		else {
			var error = '*** SparqlUtil.getFile: Incorrect fileFormat \'' + fileFormat + '\'';
			console.error(error);
			callback({
				query: query,
				fileFormat: fileFormat,
				error: error,
			});
		}
	},
};

/**
 * Require Sparql-templates as strings
 */
var Templates = {    
    'simple': {
        title: 'Simpel',
        template: require('raw!sparql-templates/simple.sparql')
    },
    'duplicates': {
        title: 'Dubblettkandidater',
        template: require('raw!sparql-templates/duplicates.sparql')
    },
	'QfBibliometrics': {
        title: 'Bibliometri',
        template: require('raw!sparql-templates/QfBibliometrics.sparql')
    },
    'quality': {
        title: 'Feltyper',
        template: require('raw!sparql-templates/quality.sparql')
    },
    'AmbiguityListing': {
        title: 'Samarbetspublikationer',
        template: require('raw!sparql-templates/AmbiguityListing.sparql')
    }
};

/**
 * fyllpå
 */
var qs = function(s) {
    var ss = s.split(',');
    for (var i=0, l=ss.length; i<l; i++) {
        ss[i] = '\'' + ss[i] + '\'';
    }
    return ss.join(',');
}

module.exports = SparqlUtil;