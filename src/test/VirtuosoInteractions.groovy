import org.junit.After
import org.junit.Before
import org.junit.Test
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-09-17.
 */

public class VirtuosoInteractions {
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
        def text = response.text;
        def json = response.json;
        assert text.length >0;
    }


}
