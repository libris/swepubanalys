package Controllers

import SparqlInteractions.SparqlEndPoint
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
        def sparql = new File('./src/main/resources/sparqlQueries/swepubPublicationYearLimits.sparql')
        def query = sparql.text;
        def resp = new SparqlEndPoint().post(query, "application/json");
        final Map map = new HashMap();
        map.put("min", ((String)response.results.bindings["callret-0"].value[0]).toInteger());
        map.put("max",((String)response.results.bindings["callret-1"].value[0]).toInteger())
        assert map.min > 1400;
        assert map.max < 3000;
        response.type("application/json");
        return resp;
    }
}
