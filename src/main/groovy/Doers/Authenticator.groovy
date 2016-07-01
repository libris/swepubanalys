package doers

import domain.LoginStatus
import spark.Request
import traits.ConfigConsumable

/**
 * Created by Theodor on 2015-12-04.
 */
class Authenticator implements ConfigConsumable {
    static boolean isLoggedIn(Request request) {
        if (currentConfig().mode == 'dev'
                && currentConfig().security.isLoggedIn) {
            true
        } else {
            (request.session(true)
                    && request.session().attribute("loggedIn") == true)
        }
    }

    static LoginStatus getLoginStatus(Request request) {
        boolean isLoggedIn = isLoggedIn(request)
        new LoginStatus(
                !isLoggedIn ? [isLoggedIn: false]
                        :
                        [
                                isLoggedIn      : true,
                                userName        : currentConfig().mode == 'dev' ? currentConfig().security.userName : request.session().attribute("userName"),
                                userId          : currentConfig().mode == 'dev' ? currentConfig().security.userId : request.session().attribute("userId"),
                                organizationCode: currentConfig().mode == 'dev' ? currentConfig().security.organizationCode : request.session().attribute("organizationCode"),
                                organizationName: currentConfig().mode == 'dev' ? currentConfig().security.organizationName : request.session().attribute("organizationName")
                        ]
        )
    }


}