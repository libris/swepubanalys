package Clients

import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-09.
 */
public class Elasticsearch {

    static String elasticURI = "http://10.50.16.150:9200"
    //static String elasticURI = "http://localhost:9200"

    public static JSONObject getStats() {
        def client = new RESTClient(elasticURI)
        def response = client.get(
                accept: ContentType.JSON,
                path: '/_stats')
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        return response.json.indices.swepub;
    }

    public static getAggs(def model) {
        def aggs = new JsonSlurper().parseText(aggregationsQuery)
        def jsonToPost = model != null ? JsonOutput.toJson([query: filterByBibliometricModel(model), aggs: aggs]) : JsonOutput.toJson([aggs: aggs])

        def client = new RESTClient(elasticURI)
        def response = client.post(
                accept: ContentType.JSON,
                path: '/swepub/bibliometric/_search',
        ) { text jsonToPost }
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        def jsonresp = response.json;
        assert jsonresp.aggregations.collect { it }.count { it } > 0;
        def output = JsonOutput.toJson(jsonresp.aggregations)
        return JsonOutput.prettyPrint(output);
    }

    static def filterByBibliometricModel(def model) {
        def queryBase = new JsonSlurper().parseText(filteredQueryBase)



        def filters = []
        addToFilter(model.org, 'hasMods.recordContentSourceValue', filters)
        addToFilter(model.subject, 'hsv3', filters)
        addToFilter(model.openaccess, 'hasMods.oaType', filters)
        addToFilter(model.status, 'publicationStatus', filters)
        addToFilter(model.publtype, 'hasMods.publicationTypeCode', filters)

        filters.add(getRangeFilter("hasMods.publicationYear",model.from,model.to))
        queryBase.filtered.filter = [bool: [must: filters.findAll{it!=null}]];

        return queryBase
    }

    static def getRangeFilter(String name, def from, def to) {
        if (to && from) {
            return [range: [(name): [lte: to, gte: from]]]
        } else if (to) {
            return [range: [(name): [lte: to]]]
        } else if (from) {
            return [range: [(name): [gte: from]]]
        }
        else return null;
    }

    static void addToFilter(def property, String name, def filters) {
        if (property) {
            filters.add(property.contains(",") ?
                    [bool: [should: property.split(",").collect { it -> [term: [(name): it]] }]]
                    : [term: [(name): property]])
        }

    }
    static String filteredQueryBase = """{
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
    "terms":{"field":"publicationStatus.raw", "size" : 0}
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
