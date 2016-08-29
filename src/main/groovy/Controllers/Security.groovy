package controllers

import spark.ModelAndView
import spark.Request
import spark.Response

class Security {

    static index(final Request request, final Response response) {
        try {
            if (request.headers("Shib-Session-ID") && request.headers("Shib-Session-ID").length() >10) {
                request.session(true)
                request.session().attribute("loggedIn", true)
                request.session().attribute("userId", request.headers("Shib-Session-ID"))
                request.session().attribute("userEmail", request.headers("mail"))
                request.session().attribute("userName", request.headers("displayName"))
                request.session().attribute("organizationName", request.headers("o"))
                request.session().attribute("organizationCode", request.headers("norEduOrgAcronym").toLowerCase())
            } else {
                request.session(true)
                request.session().attribute("loggedIn", false)
            }

            if (request.queryParams("return")) {
                response.redirect(request.queryParams("return").replace("https://","http://"))
            }
            def map = [
                    pageTitle        : "säkert-uppdaterad",
                    headers          : request.headers().collect {
                        it -> [it, request.headers(it)]
                    },
                    sessionAttributes: request.session().attribute("userId"),
                    params           : request.params().collect {
                        it -> [it, request.params(it)]
                    }


            ]
            new ModelAndView(map, "secure.mustache")

        }
        catch (all) {
            new ModelAndView([pageTitle: "säkert-uppdaterad", error: all.message], "secure.mustache")
        }


    }


}