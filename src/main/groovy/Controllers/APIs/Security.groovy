package controllers.APIs

import doers.Authenticator
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

    static def getLoginStatus(Request request, Response response) {
        boolean isLoggedIn = Authenticator.isLoggedIn(request)
        response.type("application/json")
        return JsonOutput.toJson(
                !isLoggedIn ? [isLoggedIn: false]
                        :
                        [
                                isLoggedIn: true,
                                userName  : currentConfig().mode == 'dev' ? currentConfig().security.userName : request.session().attribute("userName"),
                                userId    : currentConfig().mode == 'dev' ? currentConfig().security.userId : request.session().attribute("userId"),
                                organizationCode    : currentConfig().mode == 'dev' ? currentConfig().security.organizationCode : request.session().attribute("organizationCode"),
                                organizationName    : currentConfig().mode == 'dev' ? currentConfig().security.organizationName : request.session().attribute("organizationName")
                        ]
        )
    }
}