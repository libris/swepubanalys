package Doers

import spark.Request

/**
 * Created by Theodor on 2015-12-04.
 */
class Authenticator {
    static boolean isLoggedIn(Request request) {
        URL url = this.getClassLoader().getResource("config.groovy")
        def config = new ConfigSlurper().parse(url)
        return config.mode == 'dev' ? config.security.isLoggedIn
                : request.session(true) && request.session().attribute("loggedIn") == true
    }



}