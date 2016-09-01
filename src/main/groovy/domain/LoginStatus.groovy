package domain

import groovy.transform.Canonical

/**
 * Created by Theodor on 2016-06-28.
 */
@Canonical
class LoginStatus {
    boolean isLoggedIn
    String userName
    String userId
    String organizationCode
    String organizationName

}
