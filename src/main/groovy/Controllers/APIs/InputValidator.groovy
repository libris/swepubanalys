package controllers.APIs

import clients.Virtuoso
import validators.OrcidValidator
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import groovy.util.logging.Slf4j
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-12-14.
 */
@Slf4j
class InputValidator {
    static validateOrcid(Request request, Response response) {
        def orcid = request.queryParams("orcid")
        response.type("application/json")
        return JsonOutput.toJson(OrcidValidator.validateOrcid(orcid))

    }

    static publicationYearSpan(Response response) {
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/swepubPublicationYearLimits.sparql").getText();
        def resp = new Virtuoso().post(sparql, "application/json");
        final Map map = new HashMap();
        map["min"] = ((String) resp.results.bindings["callret-0"].value[0]).toInteger()
        map["max"] = ((String) resp.results.bindings["callret-1"].value[0]).toInteger()
        response.type("application/json");
        return new JsonBuilder(map).toPrettyString()
    }
}