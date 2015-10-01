package Controllers

import SparqlInteractions.SparqlEndPoint
import spark.Request
import spark.Response

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
}
