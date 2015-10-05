package Controllers

import SparqlInteractions.SparqlEndPoint
import groovy.json.JsonBuilder
import spark.Request
import spark.Response
import wslite.json.JSONObject

/**
 * Created by Theodor on 2015-10-01.
 */
class Api {
    static sparql(Request request, Response response) {
        def query = request.queryParams("query");
        def format = request.queryParams("format");
        def resp = new SparqlEndPoint().post(query, format)
        response.type(format);
        return resp;
    }

    static publicationYearSpan(Request request, Response response) {
        //def sparql = new File('./sparqlQueries/swepubPublicationYearLimits.sparql')
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/swepubPublicationYearLimits.sparql").getText();
        def resp = new SparqlEndPoint().post(sparql, "application/json");
        final Map map = new HashMap();
        map.put("min", ((String)resp.results.bindings["callret-0"].value[0]).toInteger());
        map.put("max",((String)resp.results.bindings["callret-1"].value[0]).toInteger())
        assert map.min > 1400;
        assert map.max < 3000;
        response.type("application/json");
        return new JsonBuilder( map ).toPrettyString()
    }
}
