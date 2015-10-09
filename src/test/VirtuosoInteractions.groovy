import Clients.Virtuoso
import org.junit.After
import org.junit.Before
import org.junit.Test
import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-09-17.
 */

public class VirtuosoInteractions {
    def sparqlCount = """PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>
PREFIX mods_m: <http://swepub.kb.se/mods/model#>
PREFIX xlink: <http://www.w3.org/1999/xlink#>
select (count(*) AS ?_numRows) where
{
{
SELECT DISTINCT
?_recordID
?_orgCode
?_pubYear
?_publicatType
?_hsv3
?_creatorCount
?_numLocalCreator
?_isiValue
?_doiValue
?_scopusValue
?_pmidValue
?_isbnValue
WHERE
{
?Record a mods_m:Record .
?Mods a mods_m:Mods .

?Mods mods_m:identifierValue ?_recordID .

OPTIONAL { ?Record swpa_m:creatorCount ?_creatorCount }

OPTIONAL { ?Record swpa_m:localCreatorCount ?_numLocalCreator . }

OPTIONAL
{
?Mods mods_m:hasIdentifier ?DOI .
?DOI mods_m:doiValue ?_doiValue .
}

OPTIONAL
{
?Mods mods_m:hasIdentifier ?ISI .
?ISI mods_m:isiValue ?_isiValue .
}

OPTIONAL
{
?Mods mods_m:hasIdentifier ?Scopus .
?Scopus mods_m:scopusValue ?_scopusValue .
}

OPTIONAL
{
?Mods mods_m:hasIdentifier ?PMID .
?PMID mods_m:pmidValue ?_pmidValue .
}

OPTIONAL
{
?Mods mods_m:hasIdentifier ?ISBN .
?ISBN mods_m:isbnValue ?_isbnValue .
}

{
SELECT DISTINCT ?Record ?Mods ?_pubYear ?_orgCode ?_publicatType ?_contentType ?_hsv1 ?_hsv3 ?_hsv5 ?_OA ?_name ?_localID ?_orcid ?_affiliation
WHERE
{
?Record mods_m:hasMods ?Mods .
?Record a mods_m:Record .
?Mods a mods_m:Mods .

?Mods swpa_m:publicationYear ?_pubYear .
?Mods mods_m:recordContentSourceValue ?_orgCode .

?Mods swpa_m:publicationTypeCode ?_publicatType .
?Mods swpa_m:contentTypeCode ?_contentType .
?Record swpa_m:isPublished ?_isPublished .
OPTIONAL { ?Mods swpa_m:oaType ?_OA }

OPTIONAL
{
?Mods mods_m:hasSubject ?Subject .
?Subject swpa_m:hsv3 ?_hsv3 .
}

?Mods mods_m:hasName ?Name .

FILTER ( xsd:string(?_orgCode) IN ( 'cth' ) )

FILTER ( ?_isPublished = 1 )

}
LIMIT 10000000
}
}
}
}"""
    def sparql = """PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>
PREFIX mods_m: <http://swepub.kb.se/mods/model#>
PREFIX xlink: <http://www.w3.org/1999/xlink#>
SELECT DISTINCT
?_recordID
?_orgCode
?_pubYear
?_publicatType
?_hsv3
WHERE
{
?Record a mods_m:Record .
?Mods a mods_m:Mods .

?Mods mods_m:identifierValue ?_recordID .

{
SELECT DISTINCT ?Record ?Mods ?_pubYear ?_orgCode ?_publicatType ?_contentType ?_hsv1 ?_hsv3 ?_hsv5 ?_OA ?_name ?_localID ?_orcid ?_affiliation
WHERE
{
?Record mods_m:hasMods ?Mods .
?Record a mods_m:Record .
?Mods a mods_m:Mods .

?Mods swpa_m:publicationYear ?_pubYear .
?Mods mods_m:recordContentSourceValue ?_orgCode .

?Mods swpa_m:publicationTypeCode ?_publicatType .
?Mods swpa_m:contentTypeCode ?_contentType .
?Record swpa_m:isPublished ?_isPublished .
OPTIONAL { ?Mods swpa_m:oaType ?_OA }

OPTIONAL
{
?Mods mods_m:hasSubject ?Subject .
?Subject swpa_m:hsv3 ?_hsv3 .
}

?Mods mods_m:hasName ?Name .

FILTER ( xsd:string(?_orgCode) IN ( 'cth' ) )
FILTER ( ?_pubYear >= 2014 )
FILTER ( ?_pubYear <= 2014 )
FILTER (xsd:string(?_publicatType) IN ( 'art' ) )

FILTER ( ?_isPublished = 1 )
FILTER ( xsd:int(?_hsv3) IN ( 101,102 ) )
FILTER ( BOUND(?_OA ))

}
LIMIT 10000000
}
}"""
    @Before
    public void setUp() throws Exception {
        printf "Set Up"
    }
    @After
    public void tearDown() throws Exception{
        printf "Tear Down"
    }

    @Test
    public void postToVirtuoso(){
        def client = new RESTClient('http://virhp07.libris.kb.se/sparql')
        def response = client.post(accept: ContentType.JSON,path:'/', query:[query:sparql, format:'application/json'])
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        assert response.json.results.bindings.count { it } > 1;


    }

    @Test
    public void postGetJson() {
        Virtuoso endPoint = new Virtuoso();
        def response = endPoint.post(sparql, "application/json")
        assert response != null;
        assert response instanceof JSONObject;
        assert response.results.bindings.count { it } > 1;
    }

    @Test
    public void postGetTSV() {
        Virtuoso endPoint = new Virtuoso();
        def response = endPoint.post(sparql, "text/tab-separated-values")
        assert response != null;
        assert response instanceof String;
        assert response.contains("\"_recordID\"\t")
    }
    @Test
    public void publicationYearSpan() {
        def sparqlSpan = new File('./src/main/resources/sparqlQueries/swepubPublicationYearLimits.sparql')
        def query = sparqlSpan.text;

        Virtuoso endPoint = new Virtuoso();
        def response = endPoint.post(query, "application/json")
        assert response != null;
        assert response instanceof JSONObject;
        def min = ((String)response.results.bindings["callret-0"].value[0]).toInteger();
        def max = ((String)response.results.bindings["callret-1"].value[0]).toInteger();
        assert min > 1400;
        assert max < 3000;
    }

    @Test
    public void postGetCSV() {
        Virtuoso endPoint = new Virtuoso();
        def response = endPoint.post(sparqlCount, "text/csv")
        assert response != null;
        assert response instanceof String;
        assert response.contains("\"_numRows\"")
    }

    @Test
    public void getGetJson() {
        Virtuoso endPoint = new Virtuoso();
        def response = endPoint.get(sparql, "application/json")
        assert response != null;
        assert response instanceof JSONObject;
        assert response.results.bindings.count { it } > 1;
    }

    @Test
    public void getGetCSV() {
        Virtuoso endPoint = new Virtuoso();
        def response = endPoint.get(sparqlCount, "text/csv")
        assert response != null;
        assert response instanceof String;
        assert response.contains("\"_numRows\"")
    }


}
