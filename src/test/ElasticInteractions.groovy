import org.junit.After
import org.junit.Before
import org.junit.Test
import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-09.
 */

class ElasticInteractions {
    @Before
    void setUp() throws Exception {
        println "Set Up"
    }

    @After
    void tearDown() throws Exception {
        println "Tear Down"
    }

    @Test
    void getElasticStats() {
        def client = new RESTClient('http://es01.kb.local:9200')
        def response = client.get(
                accept: ContentType.JSON,
                path: '/_stats')
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        println response.json.indices.swepub.primaries.docs.count;
        assert response.json.indices.swepub.primaries.docs.count > 900000;


    }

    @Test
    void getDefaultAggs() {
        def model = [model:[aggregate:'bibliometrician']]
        def aggs = Clients.Elasticsearch.getAggs(model);
        assert aggs != null;
    }
}
