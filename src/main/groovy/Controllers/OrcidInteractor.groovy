package Controllers

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
        return JsonOutput.toJson(validateOrcid(orcid));

    }

    static Map validateOrcid(String orcid){

        String[] schemes = ["http","https"]
        UrlValidator urlValidator = new UrlValidator(schemes);

        if( !urlValidator.isValid(orcid))
            return [result:false, reason:"Felaktigt utformad url"]

        URI url = new URI(orcid)
        if(url.getHost() != "orcid.org")
            return [result:false, reason:"Felaktig domän. Domänen måste vara orcid.org"]

        else return [result:true]

    }

}
