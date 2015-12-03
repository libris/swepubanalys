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
	 * Get violations
	 * @param {Function} callback
	 */
	getViolations: function(callback) {
		callback(violations);
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
        { value: 'oru', text: 'Örebro universitet' }
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
	            { value: '211', text: '211 Annan teknik' }
        	]
        },
        { 
        	label: '3 Medicin och hälsovetenskap',
			options: [
	            { value: '301', text: '301 Medicinska grundvetenskaper' },
	            { value: '302', text: '302 Klinisk medicin' },
	            { value: '303', text: '303 Hälsovetenskaper' },
	            { value: '304', text: '304 Medicinsk bioteknologi' },
	            { value: '305', text: '305 Annan medicin och hälsovetenskap' }
	        ]
        },
        { label: '4 Lantbruksvetenskap',
			options: [
	            { value: '401', text: '401 Lantbruksvetenskap, skogsbruk och fiske' },
	            { value: '402', text: '402 Husdjursvetenskap' },
	            { value: '403', text: '403 Veterinärmedicin' },
	            { value: '404', text: '404 Bioteknologi med applikationer på växter och djur' },
	            { value: '405', text: '405 Andra lantbruksrelaterade vetenskaper' }
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
	            { value: '509', text: '509 Annan samhällsvetenskap' }
	        ]
        },
        { 
        	label: '6 Humaniora',
			options: [
	            { value: '601', text: '601 Historia och arkeologi' },
	            { value: '602', text: '602 Språk och litteratur' },
	            { value: '603', text: '603 Filosofi, etik och religion' },
	            { value: '604', text: '604 Konst' },
	            { value: '605', text: '605 Annan humaniora' }
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
		{ value: 'ovr', text: 'Annan publikation' }
	],
	output: [
		{ text: 'Immaterialrättslig output - Alla', 	value: 'intellectual-property' },
		{ text: 'Immaterialrättslig output - Patent', 	value: 'intellectual-property/patent' },
		{ text: 'Immaterialrättslig output - Övriga', 	value: 'intellectual-property/other' },
		
		{ text: 'Konstnärlig output - Alla',				 					value: 'artistic-work' },
		{ text: 'Konstnärlig output (Övergripande kategori)', 					value: 'artistic-work/creative-work' },
		{ text: 'Konstnärlig output - Curerad/producerad utställning', 			value: 'artistic-work/curated-exhibition-or-event' },
		{ text: 'Konstnärlig output - Liveframförande av konstnärligt arbete', 	value: 'artistic-work/live-performance-of-creative-work' },
		{ text: 'Konstnärlig output - Konstnärligt arbete',						value: 'artistic-work/original-creative-work' },
		{ text: 'Konstnärlig output - Övriga',									value: 'artistic-work/other' },
		{ text: 'Konstnärlig output - Inspelat konstnärligt arbete',			value: 'artistic-work/recorded-or-rendered-creative-work' },
		
		{ text: 'Konferensoutput - Alla', 										value: 'conference' },
		{ text: 'Konferensoutput - Konferensbidrag (Offentliggjord, men ej förlagsutgivna)', 	value: 'conference/contribution' },
		{ text: 'Konferensoutput - Övriga',										value: 'conference/other' },
		{ text: 'Konferensoutput - Paper i proceeding', 						value: 'conference/paper' },
		{ text: 'Konferensoutput - Poster', 									value: 'conference/poster' },
		{ text: 'Konferensoutput - Proceeding (redaktörskap)', 					value: 'conference/proceeding' },
		
		{ text: 'Publikation - Alla', 											value: 'publication' },
		{ text: 'Publikation - Bok', 											value: 'publication/book' },
		{ text: 'Publikation - Kapitel i samlingsverk', 						value: 'publication/book-chapter' },
		{ text: 'Publikation - Recension', 										value: 'publication/book-review' },
		{ text: 'Publikation - Doktorsavhandling', 								value: 'publication/doctoral-thesis' },
		{ text: 'Publikation - Samlingsverk (redaktörskap)', 					value: 'publication/edited-book' },
		{ text: 'Publikation - Inledande text i tidskrift / proceeding', 		value: 'publication/editorial-letter' },
		{ text: 'Publikation - Bidrag till encyklopedi',						value: 'publication/encyclopedia-entry' },
		{ text: 'Publikation - Artikel i vetenskaplig tidskrift', 				value: 'publication/journal-article' },
		{ text: 'Publikation - Special-/temanummer av tidskrift (redaktörskap)',	value: 'publication/journal-issue' },
		{ text: 'Publikation - Licentiatavhandling', 							value: 'publication/licentiate-thesis' },
		{ text: 'Publikation - Artikel i övriga tidskrifter', 					value: 'publication/magazine-article' },
		{ text: 'Publikation - Artikel i dags-/nyhetstidning', 					value: 'publication/newspaper-article' },
		{ text: 'Publikation - Övriga',											value: 'publication/other' },
		{ text: 'Publikation - Rapport',										value: 'publication/report' },
		{ text: 'Publikation - Forskningsöversiktsartikel', 					value: 'publication/review-article' },
		{ text: 'Publikation - Textkritisk översättningsutgåva', 				value: 'publication/translation' },
		{ text: 'Publikation - Working paper', 									value: 'publication/working-paper' },
		
		{ text: 'Övrig output - Dataset', value: 'other/data-set' }
	]
};

var FILTER_FIELD_GROUPS_1 = {
    '?_ambiguityType': 'Dubblett',
    '?_dubblettID': 'Dubblett',
    '?_severity': 'Feltyp',
    '?_violatingData': 'Feltyp',
    '?_violationType': 'Feltyp',
    '?_violationTypeLabel': 'Feltyp',
    '?_incorrect': 'Feltyp',
    '?_total_match_weight': 'Feltyp',
    '?_eissn': 'Identifikator',
    '?_isbnValue': 'Identifikator',
    '?_isiValue': 'Identifikator',
    '?_issn': 'Identifikator',
    '?_orcid': 'Identifikator',
    '?_pissn': 'Identifikator',
    '?_pmidValue': 'Identifikator',
    '?_scopusValue': 'Identifikator',
    '?_uri': 'Identifikator',
    '?_doiValue': 'Identifikator',
    '?_affiliation': 'Organisation',
    '?_id1': 'Organisation',
    '?_id2': 'Organisation',
    '?_orgCode': 'Organisation',
    '?_orgCode1': 'Organisation',
    '?_orgCode2': 'Organisation',
    '?_recordID': 'Organisation',
    '?_localID': 'Person',
    '?_name': 'Person',
    '?_numLocalCreator': 'Person',
    '?_creatorCount': 'Person',
    '?_fraction': 'Person',
    '?_comment': 'Publikation',
    '?_compare': 'Publikation',
    '?_urlAdjudicationTool': 'Publikation',
    '?_channel': 'Publikation',
    '?_contentType': 'Publikation',
    '?_fulltext': 'Publikation',
    '?_hsv1': 'Publikation',
    '?_hsv3': 'Publikation',
    '?_hsv5': 'Publlikation',
    '?_isPublished': 'Publikation',
    '?_OA': 'Publikation',
    '?_outputType': 'Publikation',
	'?_outputCode': 'Publikation',
    '?_publicationID': 'Publikation',
    '?_publicatType': 'Publikation',
    '?_publisher': 'Publikation',
    '?_pubYear': 'Publikation',
    '?_status': 'Publikation',
    '?_subject': 'Publikation',
    '?_titleValue': 'Publikation',
    '?_oaipmh_1_SwePub': 'Publikation',
    '?_oaipmh_2_SwePub': 'Publikation',
    '?_oaipmh_SwePub': 'Publikation',
    '?_workID': 'Publikation',
    '?_contract': 'Övrigt',
    '?_program': 'Övrigt',
    '?_projekt': 'Övrigt'
};

var FILTER_FIELD_GROUPS_EXTERNAL = {
	'?_recordID': '1',
	'?_dubblettID': '1',
	'?_orgCode': '2',
	'?_affiliation': '2',
	'?_name': '2',
	'?_localID': '2',
	'?_creatorCount': '2',
	'?_numLocalCreator': '2',
	'?_titleValue': '3',
	'?_channel': '3',
	'?_publisher': '3',
	'?_pubYear': '3',
	'?_status': '3',
	'?_outputCode': '3',
	'?_publicatType': '3',
	'?_contentType': '3',
	'?_OA': '3',
	'?_fulltext': '3',
	'?_uri': '3',
	'?_hsv1': '4',
	'?_hsv3': '4',
	'?_hsv5': '4',
	'?_doiValue': '5',
	'?_isbnValue': '5',
	'?_isiValue': '5',
	'?_issn': '5',
	'?_orcid': '5',
	'?_pmidValue': '5',
	'?_scopusValue': '5',
	'?_projekt': '6',
	'?_program': '6',
	'?_contract': '6'
};

var filterFieldGroups = FILTER_FIELD_GROUPS_EXTERNAL;

var violations = {
	'Multiple variants of name': 2,
	'missing UK\u00c4/SCB 3-digit subject code': 1,
	'missing local creator': 3,
	'missing creator count': 3,
	'missing identifier of local creator': 3,
	'Missing Conference Title Violation': 3,
	'ISBN at wrong place violation': 3,
	'Missing ISSN Violation': 3,
	'DOI format violation': 3,
	'ISBN format Violation': 2,
	'ISSN format violation': 3,
	'href / local ID violation': 3,
	'creator count mismatch': 3,
	'ORCID format violation': 3,
	'Duplicate Name Violation': 2,
	'ISBN country code Violation': 2,
	'ISI format violation': 3,
	'Obsolete publication status violation': 2,
};

module.exports = SearchFormUtil;