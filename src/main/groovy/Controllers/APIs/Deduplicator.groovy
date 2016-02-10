package Controllers.APIs

import groovy.json.JsonBuilder
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2016-02-09.
 */
class Deduplicator {
    static def adjudicate(Request request, Response response) {
        response.type("application/json")
        def map = [result: "success"]
        try {
            assert request.queryParams("recordId1")
            assert request.queryParams("recordId2")
            assert request.queryParams("sameOrDifferent").toInteger()

        }
        catch (all) {
            map.put("errormessage", "all.message")
            map.result = "error"
        }
        return new JsonBuilder(map).toPrettyString()

    }
}
