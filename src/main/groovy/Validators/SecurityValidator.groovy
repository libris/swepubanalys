package Validators

import spark.Request

/**
 * Created by Theodor on 2016-02-16.
 */
 class SecurityValidator {
    static boolean isLoggedIn(Request request){
        try {
            return request.session().attribute("loggedIn")
        }
        catch(all){
            return false
        }
    }
}
