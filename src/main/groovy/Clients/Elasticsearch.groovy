package Clients

import groovy.json.JsonSlurper
import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-09.
 */
public  class Elasticsearch {
    public static JSONObject getStats()
    {
        def client = new RESTClient('http://10.50.16.150:9200')
        def response = client.get(
                accept: ContentType.JSON,
                path:'/_stats')
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        return  response.json.indices.swepub;
    }
    public static JSONObject getAggs(def model)
    {
        def modelToReturn = new JsonSlurper().parseText("""{"templateName":"QfBibliometrics","org":"","from":"","to":"","subject":"","publtype":"","author":"","orcid":"","openaccess":false,"status":"published"}""");

        def client = new RESTClient('http://10.50.16.150:9200')
        def response = client.post(
                accept: ContentType.JSON,
                path:'/swepub/bibliometric/_search',
               )    { json new JsonSlurper().parseText(aggregationsQuery)}
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        def jsonresp =     response.json;
        assert jsonresp.aggregations.collect{it}.count{it} >0;
        return  jsonresp.aggregations;
    }


    static String aggregationsQuery = """{
  "aggs": {
    "openaccess": {
      "terms": { "field": "hasMods.oaType" }
    },
    "contentTypes":{
    "terms":{"field":"hasMods.contentTypeCode"}
    },
    "publtype":{
    "terms":{"field":"hasMods.publicationTypeCode"}
    },
    "year":{
      "terms":{"field":"hasMods.publicationYear"}
    },
    "org":{
    "terms":{"field":"hasMods.recordContentSourceValue"}
    },
    "publicationStatuses":{
    "terms":{"field":"publicationStatus"}
    },
    "hsv1s":{
    "terms":{"field":"hsv1"}
    },
    "subject":{
    "terms":{"field":"hsv3"}
    },
    "hsv5s":{
    "terms":{"field":"hsv5"}
    },
    "missing_oa" : {
            "missing" : { "field" : "hasMods.oaType" }
     },
    "missing_hsv3" : {
            "missing" : { "field" : "hsv3" }
     }
    ,
    "missing_hsv1" : {
            "missing" : { "field" : "hsv1" }
     }
    ,
    "missing_hsv5" : {
            "missing" : { "field" : "hsv5" }
     }

  }
}"""



}
