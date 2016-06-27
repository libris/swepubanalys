package Controllers.APIs

import Traits.Controller
import Validators.SecurityValidator
import groovy.json.JsonBuilder
import groovy.transform.CompileStatic
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2016-02-09.
 */
@CompileStatic
class Deduplicator implements Controller {
    static String adjudicate(Request request, Response response) {
        response.type("application/json")
        def map = [result: "success"]
        try {
            validate(SecurityValidator.isLoggedIn(request),'User not logged in',403)
            String record1 = request.queryParams("recordId1")
            String record2 = request.queryParams("recordId2")
            int sameOrDifferent = request.queryParams("sameOrDifferent").toInteger()
            validate(sameOrDifferent == 0 || sameOrDifferent == 1, "sameOrDifferent must be either 0 or 1",400)

        }
        catch (all) {
            map.result = "error"
            map.put("errormessage", all.message)
        }
        return new JsonBuilder(map).toPrettyString()

    }

    static def getPreviouslyAdjudicated(Request request, Response response) {
        response.type("application/json")
        return new JsonBuilder(Doers.Deduplicator.getPreviouslyAdjudicated(request.queryParams("organization") ?: ""))

    }
}
