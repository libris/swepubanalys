package Controllers

import spark.Request
import spark.Response

class Security {

    static Map Login(final Request request, final Response response) {
        return [pageTitle:"Logga in", previous:request.headers("Referer")]
    }

    static Map index(final Request request, final Response response) {
        def cook = request.cookies()
        return [pageTitle:"säkert", headers:request.headers().collect{it->[it,request.headers(it)]},cookies:request.cookies().collect{it->[it,request.cookie(it)]}]
    }


}
