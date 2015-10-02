'use strict';

var jQuery = require('jquery');

/**
 * SPARQL Utilities
 */
var SparqlUtil = {
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
			return false; 
		};
		// Has a valid templateName been provided?
		if(!formModel.templateName || !Templates[formModel.templateName]) {
			console.warning(' *** SparqlUtil.getFilterFields: Incorrect templateName');
			return false;
		}
		var query = Templates[formModel.templateName].template;
		if(!query) { return false };
		var form = formModel.templateName;
		if(!form) { return false; };
    	var filterFields = formModel.filterFields;
    	if(!filterFields) { return false; };
    	
    	var limit = conf.limit || false;

	    var org = formModel.org || '';
    	var from = formModel.from || '';
    	var to = formModel.to || '';
    	var openaccess = formModel.openaccess;
    	var publtype = formModel.publtype;
    	var subject = formModel.subject || '';
    	var status = formModel.status || 'all';
    	var errortype = '';
    	var author = '';
    	var orcid = '';

    	var checked, unchecked, res, re;
    	var checked_string = '';
    	var options_string = '';
    	var filters_string = '';
    	var regex_string = '';
    	var re_select = /((?:prefix.[^]*?)?select\s*(?:distinct)?\s*)[^]*?(where[^]*?)(###\s*FILTERS\s+[^]*)/i

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
                }
                else {
					regex_string = "#START_<\\" + key + ">[^]*?#END_<\\" + key + ">.*?";
					re = new RegExp(regex_string , 'i');
					options_string = options_string.replace(re, '');
                }
            }
            if(filters_string) {
                if(org) {
                    if(form === 'duplicates') {
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode1>(.*?)<\?_orgCode1>(.*)$/mi, "$1$2" + qs(org) + "$3");
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode2>(.*?)<\?_orgCode2>(.*)$/mi, "$1$2" + qs(org) + "$3");
                    }
                    else {
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
                if(form === 'one_creator') {
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
            throw {name: 'query', messages: 'Query parse error.'};
        }
        /*
	    }
	    else {
	        checked = jQuery( ".tablecol .checkbox-dropdown-list input:checkbox:checked" ).serializeArray();

	        for (var i=0, l=checked.length; i<l; i++) {
	            checked_string += checked[i].value + '\n';
	        }

	        re_select = /((?:prefix.[^]*?)?select\s*(?:distinct)?)[^]*?(where[^]*)/i;
	        res = re_select.exec(query);
	        if ( res === null ) {
	            throw {name: 'advanced', message: 'Advanced query parse error.'};
	        }

	        query =  res[1] + checked_string + res[2];

	        if ( !limit ) {
	            // Kolla/skapa LIMIT
	            query = query.replace(/LIMIT\s+\d+\s*\n}\s*\n}\s*\n\s*LIMIT\s+\d+/i, 'LIMIT 10000000\n}\n}');
	        }
	        else {
	            // Kolla/skapa LIMIT 100
	            if ( query.search(/LIMIT\s+\d+\s*$/i) > -1 ) {
	                query = query.replace(/LIMIT\s+\d+\s*$/gmi, "LIMIT 100\n");
	            }
	            else {
	                query += "\nLIMIT 100";
	            }
	        }
		*/
		callback(query);
	},
	/**
	 * Returns available fields to filter on
	 * @param {String} templateName
	 */
	getFilterFields: function(templateName) {
		if(!Templates[templateName]) {
			console.warning(' *** SparqlUtil.getFilterFields: Incorrect templateName');
			return false;
		}
		var query = Templates[templateName].template;
		var re = /[^]*?select\s*(?:distinct)?\s*([^]*?)where/i;
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
     */
	postQuery: function(query, callback, quality, nid, refresh) {
		callback = callback || false;
		quality = quality || false;
		nid = nid || '';
		refresh = refresh || false;
		var qr = '';
		//if ( nid == 'tablecol' || nid == '' ) {
		//	sprql.query = createSprql(false);
		//	jQuery( "#sparqlcode" ).val(sprql.query);
		//}
		if(query) {
			jQuery.ajax({
				url: 'http://virhp07.libris.kb.se/sparql',
				data: { 
					query: query, 
					format: 'application/json' 
				},
				type: 'POST',
				async: true,
				crossDomain: true,
				statusCode: {
					400: function(j) {
						console.log(j);
					}
				},
				success: function(response,s,j) {
					callback(response);
					//json2table(r, refresh);
					//return false;
				},
				/*complete: function(j) {
				//console.log(j);
				switch (j.status) {
				case 404: throw { name: 'sprql', message: '404'};
				case 400: throw { name: 'sprql', message: '400'};
				}
				},*/
				error: function() { 
					throw { name: 'sprql', message: 'sparql preview failed.'}; 
				}
			}).fail(function() {
				console.log(j);
				throw { name: 'sprql', message: 'error'};
				/*switch (j.status) {
				case 404: throw { name: 'sprql', message: '404'};
				case 400: throw { name: 'sprql', message: '400'};
				}*/
			});
		}
	},
	/**
	 * Combines query and fileFormat to construct and open a request for a file
	 * @param {String} query
	 * @param {DOMElement} targetWindow
	 * @param {String} fileFormat
	 * @param {Function} callback
	 */
	getFile: function(query, targetWindow, fileFormat, callback) {
		var url = 'http://virhp07.libris.kb.se/sparql';
		if(fileFormat !== 'csv') {
			console.error('*** SparqlUtil.getFile: Incorrect fileFormat \'' + fileFormat + '\'');
			return false;
		}
		// Test this in IE9
		var request = url + '?' + 'query=' + encodeURIComponent(query) + '&format=' + encodeURIComponent(fileFormat);
		if(targetWindow) { // Use specific window, such as a <iframe>
			targetWindow.src = request;
		}
		else { // Will open new tab/window
			window.open(request);
		}
		callback({
			url: url,
			request: request,
		});
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
        template: require('raw!sparql-templates/duplicates.sparql'),
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