package Clients

import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-09.
 */
class Elasticsearch {
    public static JSONObject getStats()
    {
        def client = new RESTClient('http://es01.kb.local:9200')
        def response = client.get(
                accept: ContentType.JSON,
                path:'/_stats')
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        return  response.json.indices.swepub;
    }
}
