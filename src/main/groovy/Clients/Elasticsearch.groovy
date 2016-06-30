package clients

import traits.ConfigConsumable
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-09.
 */
public class Elasticsearch implements ConfigConsumable {

    static ElasticRESTClient() {
        return new RESTClient(currentConfig().elasticSearch.location)

    }

    public static JSONObject getStats() {
        def client = ElasticRESTClient()
        def response = client.get(
                accept: ContentType.JSON,
                path: '/_stats')
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        return response.json.indices.swepub;
    }

    public static getAggs(def model) {
        def aggs = new JsonSlurper().parseText(selectAggs(model.aggregate))
        def jsonToPost = model != null ? JsonOutput.toJson([query: filterByModel(model), aggs: aggs]) : JsonOutput.toJson([aggs: aggs])
        def client = ElasticRESTClient()
        def path = "/swepub/${model.aggregate == 'inspector' ? 'dataQuality' : 'bibliometrician'}/_search"
        def response = client.post(
                accept: ContentType.JSON,
                path: path,
        ) { text jsonToPost }
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        def jsonresp = response.json;
        assert jsonresp.aggregations.collect { it }.count { it } > 0;
        jsonresp.aggregations.total_hits = jsonresp.hits.total;
        def output = JsonOutput.toJson(jsonresp.aggregations)
        return JsonOutput.prettyPrint(output);
    }

    static def selectAggs(def aggregateName) {
        switch (aggregateName) {
            case "bibliometrician":
                return bibliometricianAggregate
                break
            case "inspector":
                return inspectorAggregate
                break
            default:
                return bibliometricianAggregate
        }
    }

    static def filterByModel(def model) {
        def queryBase = new JsonSlurper().parseText(filteredQueryBase)
        def filters = []
        addToFilter(model.org, 'recordContentSourceValue', filters)
        addToFilter(model.orcid, 'orcid', filters)
        addToFilter(model.author, 'name', filters)
        if (model.output) {
            addToFilter(model.output, 'outputCode', filters)
        }
        addToFilter(model.subject, 'hsv3', filters)
        if (model.openaccess) {
            addToFilter("green,gold", 'oaType', filters)
        }
        switch (model.status) {
            case "all":
                break
            case "published":
                addToFilter(model.status.toUpperCase(), 'publicationStatus', filters)
                break
            case "unpublished":
                addNotFilter("PUBLISHED", 'publicationStatus', filters)
                break

        }
        filters.add(getRangeFilter("publicationYear", model.from, model.to))
        queryBase.filtered.filter = [bool: [must: filters.findAll { it != null }]];

        return queryBase
    }

    static def getRangeFilter(String name, def from, def to) {
        if (to && from) {
            return [range: [(name): [lte: to, gte: from]]]
        } else if (to) {
            return [range: [(name): [lte: to]]]
        } else if (from) {
            return [range: [(name): [gte: from]]]
        } else return null;
    }

    static void addNotFilter(def property, String name, def filters) {
        if (property) {
            filters.add([not: [term: [(name): property]]])
        }

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


    static String bibliometricianAggregate = """{
    "openaccess": {
      "terms": { "field": "oaType", "size" : 0 }
    },
    "output":{
    "terms":{"field":"outputCode", "size" : 0}
    },
    "publtype":{
    "terms":{"field":"publicationTypeCode", "size" : 0}
    },
    "year":{
      "terms":{"field":"publicationYear", "size" : 0}
    },
    "org":{
    "terms":{"field":"recordContentSourceValue", "size" : 0}
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
            "missing" : { "field" : "oaType" }
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

    static String inspectorAggregate = """{
    "missingViolations": {
        "missing": {
            "field": "qualityViolations.label"
        }
    },
    "missing_violations_per_org": {
        "terms": {
            "field": "recordContentSourceValue",
            "size": 0
        },
        "aggs": {
            "missingViolations": {
                "missing": {
                    "field": "qualityViolations.label"
                }
            }
        }
    },
     "violation_severity_per_org_per_year": {
        "terms": {
            "field": "recordContentSourceValue",
            "size": 0
        },
        "aggs": {
            "year": {
                "terms": {
                    "field": "publicationYear","size":"0"
                },
                  "aggs": {
                     "severity": {
                      "terms": { "field": "qualityViolations.severity", "size":0 }
                    }
                }
            }
        }
    },
    "qualityViolations": {
        "terms": {
            "field": "qualityViolations.label",
            "size": 0
        }
    },
    "year": {
        "terms": {
            "field": "publicationYear",
            "size": 0
        }
    },
    "org": {
        "terms": {
            "field": "recordContentSourceValue",
            "size": 0
        }
    },
    "violations_per_org_per_year": {
        "terms": {
            "field": "qualityViolations.label",
            "size": 0
        },
        "aggs": {
            "org": {
                "terms": {
                    "field": "recordContentSourceValue",
                    "size": 0
                },
                "aggs": {
                    "year": {
                        "terms": {
                            "field": "publicationYear",
                            "size": 0
                        }
                    }
                }
            }
        }
    },
    "org_per_year": {
        "terms": {
            "field": "recordContentSourceValue",
            "size": 0
        },
        "aggs": {
            "year": {
                "terms": {
                    "field": "publicationYear",
                    "size": 0
                }
            }
        }
    }
}"""
}
