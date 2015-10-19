package Controllers

import Validators.OrcidValidator
import groovy.json.JsonOutput
import org.apache.commons.validator.routines.UrlValidator
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-10-12.
 */
class OrcidInteractor {

    static validateOrcid(Request request, Response response) {
        def orcid = request.queryParams("orcid");
        response.type("application/json");
        return JsonOutput.toJson(OrcidValidator.validateOrcid(orcid));

    }



}
