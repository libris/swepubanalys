describe('utils/SparqlUtil/SparqlUtil.js', function() {
	
	var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');

	it('should have apiUrl', function() {
		expect(typeof SparqlUtil.apiUrl).toEqual('string');
	});

	it('should have getFileUrl', function() {
		expect(typeof SparqlUtil.getFileUrl).toEqual('string');
	});

	it('should have proper methods', function() {
		expect(typeof SparqlUtil.generateQuery).toEqual('function');
		expect(typeof SparqlUtil.getFilterFields).toEqual('function');
		expect(typeof SparqlUtil.postQuery).toEqual('function');
		expect(typeof SparqlUtil.getFile).toEqual('function');
	});

	it('should generate a correct query using the simple-template', function() {
		SparqlUtil.generateQuery({
			formModel: simpleFormModel,
		}, function(query) {
			expect(query).toEqual(expectedSimpleQuery);
		});
	});

});

//*** Test for generating a "simple" sparql-query ***//
var expectedSimpleQuery = "PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>\nPREFIX mods_m: <http://swepub.kb.se/mods/model#> \nPREFIX xlink: <http://www.w3.org/1999/xlink#> \nSELECT DISTINCT\n?_recordID\n?_orgCode\n?_pubYear\n?_publicatType\n?_hsv3\n?_creatorCount\n?_numLocalCreator\n?_isiValue\n?_doiValue\n?_scopusValue\n?_pmidValue\n?_isbnValue\nWHERE\n{\n?Record a mods_m:Record .\n?Mods a mods_m:Mods .\n\n?Mods mods_m:identifierValue ?_recordID .\n\nOPTIONAL { ?Record swpa_m:creatorCount ?_creatorCount }\n\nOPTIONAL { ?Record swpa_m:localCreatorCount ?_numLocalCreator . } \n\nOPTIONAL\n{\n?Mods mods_m:hasIdentifier ?DOI .\n?DOI mods_m:doiValue ?_doiValue .\n}\n\nOPTIONAL\n{\n?Mods mods_m:hasIdentifier ?ISI .\n?ISI mods_m:isiValue ?_isiValue .\n}\n\nOPTIONAL\n{\n?Mods mods_m:hasIdentifier ?Scopus .\n?Scopus mods_m:scopusValue ?_scopusValue .\n}\n\nOPTIONAL\n{\n?Mods mods_m:hasIdentifier ?PMID .\n?PMID mods_m:pmidValue ?_pmidValue .\n}\n\nOPTIONAL\n{ \n?Mods mods_m:hasIdentifier ?ISBN .\n?ISBN mods_m:isbnValue ?_isbnValue .\n} \n\n{\nSELECT DISTINCT ?Record ?Mods ?_pubYear ?_orgCode ?_publicatType ?_contentType ?_hsv1 ?_hsv3 ?_hsv5 ?_OA ?_name ?_localID ?_orcid ?_affiliation\nWHERE\n{\n?Record mods_m:hasMods ?Mods .\n?Record a mods_m:Record .\n?Mods a mods_m:Mods .\n\n?Mods swpa_m:publicationYear ?_pubYear .\n?Mods mods_m:recordContentSourceValue ?_orgCode .\n\n?Mods swpa_m:publicationTypeCode ?_publicatType .\n?Mods swpa_m:contentTypeCode ?_contentType .\n?Record swpa_m:isPublished ?_isPublished .\nOPTIONAL { ?Mods swpa_m:oaType ?_OA }\n\nOPTIONAL\n{ \n?Mods mods_m:hasSubject ?Subject .\n?Subject swpa_m:hsv3 ?_hsv3 .\n}\n\n?Mods mods_m:hasName ?Name . \n\nFILTER ( xsd:string(?_orgCode) IN ( 'fhs','hhs' ) ) \nFILTER ( ?_pubYear >= 2005 ) \n\nFILTER ( ?_isPublished = 0 ) \nFILTER ( xsd:int(?_hsv3) IN ( 104 ) )\nFILTER ( BOUND(?_OA ))\n\n}\nLIMIT 10000000\n}\n}";
var simpleFormModel = {
	templateName: 'simple',
	org: 'fhs,hhs',
	from: '2005',
	to: '',
	subject: '104',
	publtype: '',
	author: '',
	orcid: '',
	openaccess: true,
	status: 'unpublished',
	filterFields: [
	    { field: "?_recordID", checked: true },
	    { field: "?_orgCode", checked: true },
	    { field: "?_pubYear", checked: true },
	    { field: "?_status", checked: false },
	    { field: "?_publicatType", checked: true },
	    { field: "?_contentType", checked: false },
	    { field: "?_OA", checked: false },
	    { field: "?_hsv1", checked: false },
	    { field: "?_hsv3", checked: true },
	    { field: "?_hsv5", checked: false },
	    { field: "?_titleValue", checked: false },
	    { field: "?_creatorCount", checked: true },
	    { field: "?_numLocalCreator", checked: true },
	    { field: "?_name", checked: false },
	    { field: "?_localID", checked: false },
	    { field: "?_orcid", checked: false },
	    { field: "?_affiliation", checked: false },
	    { field: "?_channel", checked: false },
	    { field: "?_issn", checked: false },
	    { field: "?_publisher", checked: false },
	    { field: "?_uri", checked: false },
	    { field: "?_fulltext", checked: false },
	    { field: "?_isiValue", checked: true },
	    { field: "?_doiValue", checked: true },
	    { field: "?_scopusValue", checked: true },
	    { field: "?_pmidValue", checked: true },
	    { field: "?_isbnValue", checked: true },
	    { field: "?_projekt", checked: false },
	    { field: "?_program", checked: false },
	    { field: "?_contract", checked: false }
	]
};