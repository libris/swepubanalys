package controllers.APIs

import doers.Authenticator
import domain.LoginStatus
import traits.Controller
import groovy.json.JsonOutput
import groovy.util.logging.Slf4j
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-12-14.
 */
@Slf4j
class Security implements Controller {

    static getLoginStatus(Request request, Response response) {
        response.type "application/json"
        LoginStatus loginStatus = Authenticator.getLoginStatus(request)
        return JsonOutput.prettyPrint(JsonOutput.toJson(loginStatus))
    }
    static Response logout(Request request, Response response) {
        if(request.session(true))
            request.session().attribute('loggedIn',false)
        response.redirect('/')
    }
}