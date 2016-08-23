'use strict'

// Vendor
var $ = require('jquery');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _ = require('lodash');
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
	getViolationGrades: function(callback) {
		var o = {};
		Object.keys(violations).map(function(violation) {
			o[violations[violation].text] = violations[violation].grade;
		});
		callback(o);
	},
	/**
	 *
	 */
	getViolations: function(callback) {
		callback(_cloneDeep(violations));
	},
	handleAggregations: function(aggregations) {

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
		{ value: 'bth', text: 'Blekinge tekniska högskola' },
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
		{ value: 'kth', text: 'Kungl. Tekniska högskolan' },
		{ value: 'kau', text: 'Karlstads universitet' },
		{ value: 'ki', text: 'Karolinska institutet' },
		{ value: 'konstfack', text: 'Konstfack' },
		{ value: 'kmh', text: 'Kungl. Musikhögskolan' },
		{ value: 'liu', text: 'Linköpings universitet' },
		{ value: 'lnu', text: 'Linnéuniversitetet' },
		{ value: 'ltu', text: 'Luleå tekniska universitet' },
		{ value: 'lu', text: 'Lunds universitet' },
		{ value: 'mah', text: 'Malmö högskola' },
		{ value: 'miun', text: 'Mittuniversitetet' },
		{ value: 'mdh', text: 'Mälardalens högskola' },
		{ value: 'nationalmuseum', text: 'Nationalmuseum' },
		{ value: 'nrm', text: 'Naturhistoriska riksmuseet' },
		{ value: 'naturvardsverket', text: 'Naturvårdsverket' },
		{ value: 'nai', text: 'Nordiska Afrikainstitutet' },
		{ value: 'rkh', text: 'Röda korsets högskola' },
		{ value: 'shh', text: 'Sophiahemmet högskola' },
		{ value: 'vti', text: 'Statens väg- och transportforskningsinstitut' },
		{ value: 'su', text: 'Stockholms universitet' },
		{ value: 'slu', text: 'Sveriges lantbruksuniversitet' },
		{ value: 'sh', text: 'Södertörns högskola' },
		{ value: 'umu', text: 'Umeå universitet' },
		{ value: 'uu', text: 'Uppsala universitet' },
		{ value: 'oru', text: 'Örebro universitet' }
	],
	subjects: [
        { value: '101,102,103,104,105,106,107', text: '101-107 - Naturvetenskap' },
        { value: '101', text: '101 Matematik' },
        { value: '102', text: '102 Data- och informationsvetenskap' },
        { value: '103', text: '103 Fysik' },
        { value: '104', text: '104 Kemi' },
        { value: '105', text: '105 Geovetenskap och miljövetenskap' },
        { value: '106', text: '106 Biologiska vetenskaper' },
        { value: '107', text: '107 Annan naturvetenskap' },

        { value: '201,202,203,204,205,206,207,208,209,210,211', text: '201-211 - Teknik' },
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

        { value: '301,302,303,304,305', text: '301-305 - Medicin och hälsovetenskap' },
        { value: '301', text: '301 Medicinska grundvetenskaper' },
        { value: '302', text: '302 Klinisk medicin' },
        { value: '303', text: '303 Hälsovetenskaper' },
        { value: '304', text: '304 Medicinsk bioteknologi' },
        { value: '305', text: '305 Annan medicin och hälsovetenskap' },

        { value: '401,402,403,404,405', text: '401-405 - Lantbruksvetenskap' },
        { value: '401', text: '401 Lantbruksvetenskap, skogsbruk och fiske' },
        { value: '402', text: '402 Husdjursvetenskap' },
        { value: '403', text: '403 Veterinärmedicin' },
        { value: '404', text: '404 Bioteknologi med applikationer på växter och djur' },
        { value: '405', text: '405 Andra lantbruksrelaterade vetenskaper' },

        { value: '501,502,503,504,505,506,507,508,509', text: '501-509 - Samhällsvetenskap' },
        { value: '501', text: '501 Psykologi' },
        { value: '502', text: '502 Ekonomi och näringsliv' },
        { value: '503', text: '503 Utbildningsvetenskap' },
        { value: '504', text: '504 Sociologi' },
        { value: '505', text: '505 Juridik' },
        { value: '506', text: '506 Statsvetenskap' },
        { value: '507', text: '507 Social och ekonomisk geografi' },
        { value: '508', text: '508 Medie- och kommunikationsvetenskap' },
        { value: '509', text: '509 Annan samhällsvetenskap' },

        { value: '601,602,603,604,605', text: '601-605 - Humaniora' },
        { value: '601', text: '601 Historia och arkeologi' },
        { value: '602', text: '602 Språk och litteratur' },
        { value: '603', text: '603 Filosofi, etik och religion' },
        { value: '604', text: '604 Konst' },
        { value: '605', text: '605 Annan humaniora' }
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
		{ value: 'artistic-work,artistic-work/original-creative-work,artistic-work/curated-exhibition-or-event', text: 'Konstnärlig output - Alla' },
		{ value: 'artistic-work', text: 'Konstnärlig output' },
		{ value: 'artistic-work/original-creative-work', text: 'Konstnärlig output - Konstnärligt arbete' },
		{ value: 'artistic-work/curated-exhibition-or-event', text: 'Konstnärlig output - Curerad/producerad utställning/event' },
		
		{ value: 'publication,publication/book,publication/edited-book,publication/book-chapter,publication/report-chapter,publication/report,publication/journal-article,publication/review-article,publication/editorial-letter,publication/book-review,publication/magazine-article,publication/newspaper-article,publication/encyclopedia-entry,publication/doctoral-thesis,publication/licentiate-thesis,publication/translation,publication/working-paper,publication/journal-issue,publication/other', text: 'Publikationer – Alla' },
		{ value: 'publication', text: 'Publikationer' },
		{ value: 'publication/book', text: 'Publikationer – Bok' },
		{ value: 'publication/edited-book', text: 'Publikationer – Samlingsverk (redaktörskap)' },
		{ value: 'publication/book-chapter', text: 'Publikationer – Kapitel i samlingsverk' },
		{ value: 'publication/report-chapter', text: 'Publikationer – Kapitel i rapport' },
		{ value: 'publication/report', text: 'Publikationer – Rapport' },
		{ value: 'publication/journal-article', text: 'Publikationer – Artikel i vetenskaplig tidskrift' },
		{ value: 'publication/review-article', text: 'Publikationer – Forskningsöversiktsartikel' },
		{ value: 'publication/editorial-letter', text: 'Publikationer – Inledande text i tidskrift/proceeding' },
		{ value: 'publication/book-review', text: 'Publikationer – Recension' },
		{ value: 'publication/magazine-article', text: 'Publikationer – Artikel i övriga tidskrifter' },
		{ value: 'publication/newspaper-article', text: 'Publikationer – Artikel i dags-/nyhetstidning' },
		{ value: 'publication/encyclopedia-entry', text: 'Publikationer – Bidrag i encyklopedi' },
		{ value: 'publication/doctoral-thesis', text: 'Publikationer – Doktorsavhandling' },
		{ value: 'publication/licentiate-thesis', text: 'Publikationer – Licentiatavhandling' },
		{ value: 'publication/translation', text: 'Publikationer – Textkritisk översättningsutgåva' },
		{ value: 'publication/working-paper', text: 'Publikationer – Working paper' },
		{ value: 'publication/journal-issue', text: 'Publikationer – Special-/temanummer av tidskrift (redaktörskap)' },
		{ value: 'publication/other', text: 'Publikationer – Övrig publikation' },
		
		{ value: 'conference,conference/paper,conference/poster,conference/proceeding,conference/other', text: 'Konferensoutput - Alla' },
		{ value: 'conference', text: 'Konferensoutput' },
		{ value: 'conference/paper', text: 'Konferensoutput – Paper i proceeding' },
		{ value: 'conference/poster', text: 'Konferensoutput – Poster' },
		{ value: 'conference/proceeding', text: 'Konferensoutput – Proceeding (redaktörskap)' },
		{ value: 'conference/other', text: 'Konferensoutput – Övriga konferensbidrag' },
		
		{ value: 'intellectual-property,intellectual-property/patent,intellectual-property/other', text: 'Immaterialrättslig output - Alla' },
		{ value: 'intellectual-property', text: 'Immaterialrättslig output' },
		{ value: 'intellectual-property/patent', text: 'Immaterialrättslig output - Patent' },
		{ value: 'intellectual-property/other', text: 'Immaterialrättslig output – Övrig immaterialrättslig output' },
		
		{ value: 'other,other/dataset', text: 'Övrig output - Alla' },
		{ value: 'other', text: 'Övrig output' },
		{ value: 'other/dataset', text: 'Övrig output – Dataset' }
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
	'swpa_m:LocalPersonIDMultipleNameVariants': { text: 'Upphov - olika namnvarianter', name: 'Multiple variants of name', grade: 2 },
	'swpa_m:MissingHSV3Violation': 				{ text: 'Ämne saknas', name: 'missing UK\u00c4/SCB 3-digit subject code', grade: 1 },
	'swpa_m:MissingLocalCreatorViolation': 		{ text: 'Upphov saknas', name: 'missing local creator', grade: 3 },
	'swpa_m:MissingLocalCreatorIdentifierViolation': 	{ text: 'PersonalID saknas', name: 'missing identifier of local creator', grade: 3 },
	'swpa_m:MissingCreatorCountViolation': 		{ text: 'Upphov - antal saknas', name: 'missing creator count', grade: 3 },
	'swpa_m:MissingConferenceTitleViolation': 	{ text: 'Konferens - saknad', name: 'Missing Conference Title Violation', grade: 3 },
	'swpa_m:ISBNAtWrongPlaceViolation': 		{ text: 'ISBN på fel nivå', name: 'ISBN at wrong place violation', grade: 3 },
	'swpa_m:MissingISSNViolation':				{ text: 'ISSN saknas', name: 'Missing ISSN Violation', grade: 3 },
	'swpa_m:DOIViolation': 						{ text: 'DOI fel', name: 'DOI format violation', grade: 3 },
	'swpa_m:ISBNFormatViolation': 				{ text: 'ISBN fel', name: 'ISBN format Violation', grade: 2 },
	'swpa_m:ISSNViolation': 					{ text: 'ISSN fel', name: 'ISSN format violation', grade: 3 },
	'swpa_m:HREFViolation': 					{ text: 'PersonalID fel', name: 'href / local ID violation', grade: 3 },
	'swpa_m:CreatorCountMismatchViolation': 	{ text: 'Upphov - olika antal', name: 'creator count mismatch', grade: 3 },
	'swpa_m:ORCIDViolation': 					{ text: 'ORCID fel', name: 'ORCID format violation', grade: 3 },
	'swpa_m:DuplicateNameViolation': 			{ text: 'Upphov - dubblering', name: 'Duplicate Name Violation', grade: 2 },
	'swpa_m:ISBNCountryCodeViolation': 			{ text: 'ISBN - fel landkod', name: 'ISBN country code Violation', grade: 2 },
	'swpa_m:ISIFormatViolation': 				{ text: 'ISI-ID fel', name: 'ISI format violation', grade: 3 },
	'swpa_m:ObsoletePublicationStatusViolation': { text: 'Publiceringsstatus fel', name: 'Obsolete publication status violation', grade: 2 }
};

module.exports = SearchFormUtil;