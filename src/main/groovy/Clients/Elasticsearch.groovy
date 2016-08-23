package clients

import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-09.
 */
public class Elasticsearch implements traits.ConfigConsumable {

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
        jsonresp.aggregations.total_hits = getTotalHits(model)
        def output = JsonOutput.toJson(jsonresp.aggregations)
        return JsonOutput.prettyPrint(output);
    }

    static getTotalHits(def model) {
        def client = ElasticRESTClient()
        def indexName = { String templateName ->
            switch (templateName) {
                case "AmbiguityListing":
                    "ambiguities"
                    break
                case "quality":
                    "dataQuality"
                    break
                case "duplicates":
                    "duplicates"
                    break
                case "QFBibliometrics":
                    "bibliometrician"
                    break
                default:
                    "bibliometrician"
            }
        }
        def path = "/swepub/${indexName(model.templateName)}/_search"
        def response = client.post(
                accept: ContentType.JSON,
                path: path,
        ) { text JsonOutput.toJson([query: filterByModel(model)]) }
        assert 200 == response.statusCode
        assert response != null;
        assert response.json instanceof JSONObject;
        response.json.hits.total
    }

    static def selectAggs(String aggregateName) {
        def getResource = { String location -> this.classLoader.getResource(location).text }
        switch (aggregateName) {
            case "bibliometrician":
                getResource "elasticSearchTemplates/bibliometricianAggregate.json"
                break
            case "inspector":
                getResource "elasticSearchTemplates/inspectorAggregate.json"
                break
            case "duplicates":
                getResource "elasticSearchTemplates/duplicateAggregate.json"
                break
            case "AmbiguityListing":
                getResource "elasticSearchTemplates/ambiguityAggregate.json"
                break
            default:
                getResource "elasticSearchTemplates/bibliometricianAggregate.json"
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

}
