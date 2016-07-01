package controllers.APIs

import doers.Authenticator
import domain.LoginStatus
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import groovy.transform.CompileStatic
import org.apache.commons.validator.routines.UrlValidator
import spark.Request
import spark.Response
import traits.Controller

/**
 * Created by Theodor on 2016-02-09.
 */
@CompileStatic
class Deduplicator implements Controller {
    static String adjudicate(Request request, Response response) {
        validate(Authenticator.isLoggedIn(request), 403, 'User not logged in')
        validateQueryParameters(['recordId1', 'recordId2', 'sameOrDifferent'] as String[], request)
        validate((0..1).contains(request.queryParams("sameOrDifferent").toInteger()), 400, 'Value of sameOrDifferent must be 0 or 1')

        String record1 = request.queryParams("recordId1")
        String record2 = request.queryParams("recordId2")
        def urlVal = new UrlValidator(["http", "https"] as String[])
        validate(urlVal.isValid(record1), 400, "Parameter recordId1 is not a valid URL")
        validate(urlVal.isValid(record2), 400, "Parameter recordId2 is not a valid URL")
        def allowedOrganizations = doers.Deduplicator.getOrganizationsFromRecordUris(record1,record2)
        LoginStatus loginStatus = Authenticator.getLoginStatus(request)

        validate(
                allowedOrganizations.contains(loginStatus.organizationCode) || loginStatus.organizationCode == 'kb',
                403,
                "You are trying to adjudicate records from another organization than your own"
        )

        int sameOrDifferent = request.queryParams("sameOrDifferent").toInteger()


        response.type("application/json")
        def map = [result: "success"]
        try {
            assert loginStatus.isLoggedIn
            doers.Deduplicator.saveDuplicateCase(
                    sameOrDifferent as boolean,
                    record1,
                    record2,
                    JsonOutput.prettyPrint(JsonOutput.toJson(loginStatus)),
                    loginStatus.userName)
        }
        catch (all) {
            map.result = "error"
            map.put("errormessage", all.message)
            throw all
        }
        return new JsonBuilder(map).toPrettyString()

    }

    static def getPreviouslyAdjudicated(Request request, Response response) {
        //TODO: if organization is set, check that it is an actual organizationcode...
        response.type("application/json")
        return new JsonBuilder(doers.Deduplicator.getPreviouslyAdjudicated(request.queryParams("organization") ?: ""))

    }
}
