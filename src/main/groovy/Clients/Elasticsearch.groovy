package Clients

import groovy.json.JsonOutput
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
    public static JSONObject getAggs(Map model)
    {
        def aggs = new JsonSlurper().parseText(aggregationsQuery)
        def jsonToPost = model!=null ? JsonOutput.toJson([query: filterByModel(model), aggs: aggs]): JsonOutput.toJson([aggs: aggs])

        def client = new RESTClient('http://10.50.16.150:9200')
        def response = client.post(
                accept: ContentType.JSON,
                path:'/swepub/bibliometric/_search',
               )    { text jsonToPost}
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        def jsonresp =    response.json;
        assert jsonresp.aggregations.collect{it}.count{it} >0;
        return  jsonresp.aggregations;
    }

    static def filterByModel(Map model) {
        def qb = new JsonSlurper().parseText(filteredQueryBase);
        qb.filtered.filter.bool.must = model.org.contains(",") ?
                [bool:[should: model.org.split(",").collect{it -> [term: ['hasMods.recordContentSourceValue':it]] }]]
                : [term: ['hasMods.recordContentSourceValue':model.org]]
        return qb;
    }
    static String filteredQueryBase =   """{
        "filtered": {
            "filter": {
                "bool": {
                    "must":""
                }
            }
        }
    }"""


    static String aggregationsQuery = """{
    "openaccess": {
      "terms": { "field": "hasMods.oaType", "size" : 0 }
    },
    "contentTypes":{
    "terms":{"field":"hasMods.contentTypeCode", "size" : 0}
    },
    "publtype":{
    "terms":{"field":"hasMods.publicationTypeCode", "size" : 0}
    },
    "year":{
      "terms":{"field":"hasMods.publicationYear", "size" : 0}
    },
    "org":{
    "terms":{"field":"hasMods.recordContentSourceValue", "size" : 0}
    },
    "publicationStatuses":{
    "terms":{"field":"publicationStatus", "size" : 0}
    },
    "hsv1s":{
    "terms":{"field":"hsv1", "size" : 0}
    },
    "subject":{
    "terms":{"field":"hsv3", "size" : 0}
    },
    "missing_oa" : {
            "missing" : { "field" : "hasMods.oaType" }
     },
    "missing_hsv3" : {
            "missing" : { "field" : "hsv3"}
     }
    ,
    "missing_hsv1" : {
            "missing" : { "field" : "hsv1"}
     }
    ,
    "missing_hsv5" : {
            "missing" : { "field" : "hsv5" }
     }

  }"""



}
