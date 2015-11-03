package Controllers

import spark.Request
import spark.Response

class Security {

    static Map Login(final Request request, final Response response) {
        return [pageTitle:"Logga in", previous:request.headers("Referer")]
    }
}
