'use strict'

// Vendor
var $ = require('jquery');

/**
 * Search Form Utilities
 */
var SearchFormUtil = {
	apiUrl: '/api/2.0',
	/**
	 * Returns form suggestions. This method will likely be used with an async request in the future,
	 * such as to an external .json file or db-request.
	 * @param {Function} callback
	 */
	getFormSuggestions: function(callback) {
		callback(formSuggestions);
	},
	/**
	 * Returns form tests used to validate input to form fields
	 * @param {Function} callback
	 */
	getFormTests: function(callback) {
		callback(formTests);		
	},
	/**
	 * Returns groupings for filterFields
	 * @param {Function} callback
	 */
	getFilterFieldGroups: function(callback) {
		callback(filterFieldGroups);
	},
	/**
	 * Validates a orcid-value
	 * @param {String} value
	 * @param {Function} callback
	 */
	validateOrcidUrl: function(value, callback) {
		$.ajax({
			url: this.apiUrl + '/validate/orcid?orcid=' + value,
			type: 'GET',
			success: function(response) {
				callback(response);
			},
			error: function(response) {
				callback(response);
			}
		});
	},
	/**
	 * Gets publication year span
	 * @param {Function} callback
	 */
	getPublicationYearSpan: function(callback) {
		$.ajax({
			url: this.apiUrl + '/publicationYearSpan',
			type: 'GET',
			success: function(response) {
				callback(response);
			},
			error: function(response) {
				callback(response);
			}
		});
	}
};

var formTests = {
	time: {
		expression: '^$|^\\d+$', // Only digits, please
		errorMessage: 'Ogiltigt årtal angivet',
	}
};

var formSuggestions = {
	orgs: [
		{ value: 'bth', text: 'Blekinge Tekniska Högskola' },
        { value: 'cth', text: 'Chalmers tekniska högskola' },
        { value: 'esh', text: 'Ersta Sköndal högskola' },
        { value: 'fhs', text: 'Försvarshögskolan' },
        { value: 'gih', text: 'Gymnastik- och idrottshögskolan' },
        { value: 'gu', text: 'Göteborgs universitet' },
        { value: 'hhs', text: 'Handelshögskolan i Stockholm' },
        { value: 'du', text: 'Högskolan Dalarna' },
        { value: 'hkr', text: 'Högskolan Kristianstad' },
        { value: 'hv', text: 'Högskolan Väst' },
        { value: 'hb', text: 'Högskolan i Borås' },
        { value: 'hig', text: 'Högskolan i Gävle' },
        { value: 'hh', text: 'Högskolan i Halmstad' },
        { value: 'hj', text: 'Högskolan i Jönköping' },
        { value: 'his', text: 'Högskolan i Skövde' },
        { value: 'kth', text: 'KTH' },
        { value: 'kau', text: 'Karlstads universitet' },
        { value: 'ki', text: 'Karolinska Institutet' },
        { value: 'konstfack', text: 'Konstfack' },
        { value: 'kmh', text: 'Kungliga Musikhögskolan' },
        { value: 'liu', text: 'Linköpings universitet' },
        { value: 'lnu', text: 'Linnéuniversitetet' },
        { value: 'ltu', text: 'Luleåtekniska universitet' },
        { value: 'lu', text: 'Lunds universitet' },
        { value: 'mah', text: 'Malmö Högskola' },
        { value: 'miun', text: 'Mittuniversitetet' },
        { value: 'mdh', text: 'Mälardalens högskola' },
        { value: 'nationalmuseum', text: 'Nationalmuseum' },
        { value: 'nrm', text: 'Naturhistoriska riksmuseet' },
        { value: 'naturvardsverket', text: 'Naturvårdsverket' },
        { value: 'nai', text: 'Nordiska Afrikainstitutet' },
        { value: 'rkh', text: 'Röda Korsets Högskola' },
        { value: 'shh', text: 'Sophiahemmet Högskola' },
        { value: 'vti', text: 'Statens väg- och transportforskningsinstitut' },
        { value: 'su', text: 'Stockholms universitet' },
        { value: 'slu', text: 'Sveriges lantbruksuniversitet' },
        { value: 'sh', text: 'Södertörns högskola' },
        { value: 'umu', text: 'Umeåuniversitet' },
        { value: 'uu', text: 'Uppsala universitet' },
        { value: 'oru', text: 'Örebro universitet' },
	],
	subjects: [
		{ 
			label: '1 Naturvetenskap',
			options: [
				{ value: '101', text: '101 Matematik' },
	            { value: '102', text: '102 Data- och informationsvetenskap' },
	            { value: '103', text: '103 Fysik' },
	            { value: '104', text: '104 Kemi' },
	            { value: '105', text: '105 Geovetenskap och miljövetenskap' },
	            { value: '106', text: '106 Biologiska vetenskaper' },
	            { value: '107', text: '107 Annan naturvetenskap' }
            ]
        },
        { 
        	label: '2 Teknik',
			options: [
	            { value: '201', text: '201 Samhällsbyggnadsteknik' },
	            { value: '202', text: '202 Elektroteknik och elektronik' },
	            { value: '203', text: '203 Maskinteknik' },
	            { value: '204', text: '204 Kemiteknik' },
	            { value: '205', text: '205 Materialteknik' },
	            { value: '206', text: '206 Medicinteknik' },
	            { value: '207', text: '207 Naturresursteknik' },
	            { value: '208', text: '208 Miljöbioteknik' },
	            { value: '209', text: '209 Industriell bioteknik' },
	            { value: '210', text: '210 Nanoteknik' },
	            { value: '211', text: '211 Annan teknik' },
        	]
        },
        { 
        	label: '3 Medicin och hälsovetenskap',
			options: [
	            { value: '301', text: '301 Medicinska grundvetenskaper' },
	            { value: '302', text: '302 Klinisk medicin' },
	            { value: '303', text: '303 Hälsovetenskaper' },
	            { value: '304', text: '304 Medicinsk bioteknologi' },
	            { value: '305', text: '305 Annan medicin och hälsovetenskap' },
	        ]
        },
        { label: '4 Lantbruksvetenskap',
			options: [
	            { value: '401', text: '401 Lantbruksvetenskap, skogsbruk och fiske' },
	            { value: '402', text: '402 Husdjursvetenskap' },
	            { value: '403', text: '403 Veterinärmedicin' },
	            { value: '404', text: '404 Bioteknologi med applikationer på växter och djur' },
	            { value: '405', text: '405 Andra lantbruksrelaterade vetenskaper' },
	        ]
        },
        { 
        	label: '5 Samhällsvetenskap',
			options: [
	            { value: '501', text: '501 Psykologi' },
	            { value: '502', text: '502 Ekonomi och näringsliv' },
	            { value: '503', text: '503 Utbildningsvetenskap' },
	            { value: '504', text: '504 Sociologi' },
	            { value: '505', text: '505 Juridik' },
	            { value: '506', text: '506 Statsvetenskap' },
	            { value: '507', text: '507 Social och ekonomisk geografi' },
	            { value: '508', text: '508 Medie- och kommunikationsvetenskap' },
	            { value: '509', text: '509 Annan samhällsvetenskap' },
	        ]
        },
        { 
        	label: '6 Humaniora',
			options: [
	            { value: '601', text: '601 Historia och arkeologi' },
	            { value: '602', text: '602 Språk och litteratur' },
	            { value: '603', text: '603 Filosofi, etik och religion' },
	            { value: '604', text: '604 Konst' },
	            { value: '605', text: '605 Annan humaniora' },
	        ]
	    }
	],
	publTypes: [
		{ value: 'bok', text: 'Bok' },
		{ value: 'kap', text: 'Bokkapitel' },
		{ value: 'dok', text: 'Doktorsavhandling' },
		{ value: 'for', text: 'Forskningsöversikt' },
		{ value: 'kon', text: 'Konferensbidrag' },
		{ value: 'kfu', text: 'Konstnärligt arbete' },
		{ value: 'lic', text: 'Licentiatavhandling' },
		{ value: 'pat', text: 'Patent' },
		{ value: 'pro', text: 'Proceedings (redaktörskap)' },
		{ value: 'rap', text: 'Rapport' },
		{ value: 'rec', text: 'Recension' },
		{ value: 'sam', text: 'Samlingsverk (redaktörskap)' },
		{ value: 'art', text: 'Tidskriftsartikel' },
		{ value: 'ovr', text: 'Annan publikation' },
	]
};

var filterFieldGroups = {
	'?_ambiguityType': 'Dubblett',
	'?_dubblettID': 'Dubblett',
	'?_severity': 'Feltyp',
	'?_violatingData': 'Feltyp',
	'?_violationType': 'Feltyp',
	'?_violationType': 'Feltyp',
	'?_violationTypeLabel': 'Feltyp',
	'?_incorrect': 'Feltyp',
	'?_total_match_weight': 'Feltyp',
	'?_eissn': 'Identifikator',
	'?_isbnValue': 'Identifikator',
	'?_isbnValue': 'Identifikator',
	'?_isiValue': 'Identifikator',
	'?_isiValue': 'Identifikator',
	'?_issn': 'Identifikator',
	'?_issn': 'Identifikator',
	'?_orcid': 'Identifikator',
	'?_orcid': 'Identifikator',
	'?_pissn': 'Identifikator',
	'?_pmidValue': 'Identifikator',
	'?_scopusValue': 'Identifikator',
	'?_uri': 'Identifikator',
	'?_uri': 'Identifikator',
	'?_doiValue': 'Identifikator', 
	'?_doiValue': 'Identifikator', 
	'?_affiliation': 'Organisation',
	'?_affiliation': 'Organisation',
	'?_id1': 'Organisation',
	'?_id2': 'Organisation',
	'?_orgCode': 'Organisation',
	'?_orgCode': 'Organisation',
	'?_orgCode1': 'Organisation',
	'?_orgCode1': 'Organisation',
	'?_orgCode2': 'Organisation',
	'?_orgCode2': 'Organisation',
	'?_recordID': 'Organisation',
	'?_localID': 'Person',
	'?_localID': 'Person',
	'?_name': 'Person',
	'?_name': 'Person',
	'?_name': 'Person',
	'?_name': 'Person',
	'?_numLocalCreator': 'Person',
	'?_numLocalCreator': 'Person',
	'?_creatorCount': 'Person',
	'?_creatorCount': 'Person',
	'?_fraction': 'Person',
	'?_comment': 'Publikation',
	'?_compare': 'Publikation',
	'?_urlAdjudicationTool': 'Publikation',
	'?_channel': 'Publikation',
	'?_contentType': 'Publikation',
	'?_fulltext': 'Publikation',
	'?_fulltext': 'Publikation',
	'?_hsv1': 'Publikation',
	'?_hsv1': 'Publikation',
	'?_hsv3': 'Publikation',
	'?_hsv3': 'Publikation',
	'?_hsv5': 'Publikation',
	'?_isPublished': 'Publikation',
	'?_OA': 'Publikation',
	'?_outputType': 'Publikation',
	'?_publicationID': 'Publikation',
	'?_publicatType': 'Publikation',
	'?_publicatType': 'Publikation',
	'?_publisher': 'Publikation',
	'?_publisher': 'Publikation',
	'?_pubYear': 'Publikation',
	'?_status': 'Publikation',
	'?_subject': 'Publikation',
	'?_titleValue': 'Publikation',
	'?_titleValue': 'Publikation',
	'?_oaipmh_1_SwePub': 'Publikation',
	'?_oaipmh_2_SwePub': 'Publikation',
	'?_oaipmh_SwePub': 'Publikation',
	'?_workID': 'Publikation',
	'?_hsv5': 'Publlikation',
	'?_contract': 'Övrigt',
	'?_program': 'Övrigt',
	'?_projekt': 'Övrigt',
};

module.exports = SearchFormUtil;