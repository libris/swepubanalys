package Controllers

import Clients.Elasticsearch
import Clients.Virtuoso
import groovy.json.JsonBuilder
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-10-01.
 */
class Api {


    static sparql(Request request, Response response) {
        def query = request.queryParams("query");
        def format = request.queryParams("format");
        def resp = new Virtuoso().post(query, format)
        response.type(format);
        return resp;
    }

    static publicationYearSpan(Response response) {
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/swepubPublicationYearLimits.sparql").getText();
        def resp = new Virtuoso().post(sparql, "application/json");
        final Map map = new HashMap();
        map.put("min", ((String)resp.results.bindings["callret-0"].value[0]).toInteger());
        map.put("max",((String)resp.results.bindings["callret-1"].value[0]).toInteger())
        response.type("application/json");
        return new JsonBuilder( map ).toPrettyString()
    }

    static getStats(Response response)  {
        response.type("application/json");
        return Elasticsearch.getStats();
    }
    static getAggregations(Response response)  {
        response.type("application/json");
        return Elasticsearch.getAggs();
    }


}
