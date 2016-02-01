package Controllers.APIs

import Doers.Authenticator
import groovy.json.JsonOutput
import groovy.util.logging.Slf4j
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-12-14.
 */
@Slf4j
class Security {

    static def getLoginStatus(Request request, Response response) {
        def config = new ConfigSlurper().parse(Security.getClassLoader().getResource("config.groovy"))

        boolean isLoggedIn = Authenticator.isLoggedIn(request)

        response.type("application/json");
        return JsonOutput.toJson(
                !isLoggedIn ? [isLoggedIn: false]
                        :
                        [
                                isLoggedIn: true,
                                userName  : config.mode == 'dev'? config.security.userName :  request.session().attribute("userName"),
                                userId    : config.mode == 'dev'? config.security.userId : request.session().attribute("userId")

                        ]
        )
    }
}