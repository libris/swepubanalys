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
        def client = new RESTClient('http://es01.kb.local:9200')
        def response = client.get(
                accept: ContentType.JSON,
                path:'/_stats')
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        return  response.json.indices.swepub;
    }
    public  JSONObject getAggs(def query)
    {
        def client = new RESTClient('http://es01.kb.local:9200')
        def response = client.post(
                accept: ContentType.JSON,
                path:'/swepub/bibliometric/_search',
               )    { json defaultAggs}

        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        def jsonresp =     response.json;
        assert jsonresp.aggregations.collect{it}.count{it} >0;
        return  jsonresp.aggregations;
    }

     def  defaultAggs = new JsonSlurper().parseText("""{
  "aggs": {
    "oaTypes": {
      "terms": { "field": "oaType" }
    },
    "contentTypes":{
    "terms":{"field":"contentTypeCode"}
    },
    "publicationTypes":{
    "terms":{"field":"publicationType"}
    },
    "sources":{
    "terms":{"field":"recordContentSourceValue"}
    },
    "publicationStatuses":{
    "terms":{"field":"publicationStatus"}
    },
    "hsv1s":{
    "terms":{"field":"hsv1"}
    },
    "hsv2s":{
    "terms":{"field":"hsv2"}
    },
    "hsv3s":{
    "terms":{"field":"hsv3"}
    }
  }
}""" )

}
