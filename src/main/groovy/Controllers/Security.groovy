package Controllers
import spark.Request
import spark.Response

class Security {

    static Map index(final Request request, final Response response) {

        if (request.headers("persistent-id") && request.headers("persistent-id").startsWith("https://")) {
            request.session(true)
            request.session().attribute("loggedIn", true)
            request.session().attribute("userId", request.headers("persistent-id"))
            request.session().attribute("userEmail", request.headers("mail"))
            request.session().attribute("userName", request.headers("displayName"))
            request.session().attribute("userOrganization", request.headers("o"))
        } else {
            request.session(true)
            request.session().attribute("loggedIn", false)
        }

        return [
                pageTitle        : "säkert",
                headers          : request.headers().collect {
                    it -> [it, request.headers(it)]
                },
                sessionAttributes: request.session().attribute("userId"),
                params           : request.params().collect {
                    it -> [it, request.params(it)]
                }


        ]
    }


}