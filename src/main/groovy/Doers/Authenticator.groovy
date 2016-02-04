package Doers

import Traits.ConfigConsumable
import spark.Request

/**
 * Created by Theodor on 2015-12-04.
 */
class Authenticator implements ConfigConsumable  {
    static boolean isLoggedIn(Request request) {
         return currentConfig().mode == 'dev' ? currentConfig().security.isLoggedIn
                : request.session(true) && request.session().attribute("loggedIn") == true
    }



}