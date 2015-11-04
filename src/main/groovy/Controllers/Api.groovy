package Controllers

import Clients.Elasticsearch
import Doers.AmbiguityCase
import Doers.SparqlResultExporter
import Clients.Virtuoso
import Validators.OrcidValidator
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import spark.Request
import spark.Response
import groovy.util.logging.Slf4j

/**
 * This class sits between Route configuration and actual testable use case code (Doers) for the API parts of the system
 */
@Slf4j
class Api {
    //TODO: Refactor so the methods are testable....

    static sparql(Request request, Response response) {
        def query = request.queryParams("query");
        def format = request.queryParams("format");
        def resp = new Virtuoso().post(query, format)
        response.type(format);
        return resp;
    }

    static getDataQualityViolations(Response response)  {
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/DataQualityViolation.sparql").getText();
        def resp = new Virtuoso().post(sparql, "application/json");
        def map = [values: resp.results.bindings.collect { it -> [name: it["_label"].value, comment: it["_comment"].value, severity: it["_severity"].value] }]
        response.type("application/json");
        return new JsonBuilder(map).toPrettyString()

    }

    static publicationYearSpan(Response response) {
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/swepubPublicationYearLimits.sparql").getText();
        def resp = new Virtuoso().post(sparql, "application/json");
        final Map map = new HashMap();
        map["min"] =  ((String)resp.results.bindings["callret-0"].value[0]).toInteger()
        map["max"] = ((String) resp.results.bindings["callret-1"].value[0]).toInteger()
        response.type("application/json");
        return new JsonBuilder( map ).toPrettyString()
    }

    static getStats(Response response)  {
        response.type("application/json");
        return Elasticsearch.getStats();
    }
    static getAggregations(Request request, Response response)  {

        def model = request.queryParams("model") != null ? new JsonSlurper().parseText(request.queryParams("model")):null;
        response.type("application/json");
        return Elasticsearch.getAggs(model);
    }

    static validateOrcid(Request request, Response response) {
        def orcid = request.queryParams("orcid");
        response.type("application/json");
        return JsonOutput.toJson(OrcidValidator.validateOrcid(orcid));

    }

    static def dataQuery(Request request, Response response) {
        def exporter = new SparqlResultExporter();
        response.type("application/json");
        return  exporter.startQueryAndDownload(request.queryParams("query"), request.queryParams("format"),request.queryParams("email"), request.queryParams("zip") == "true" );

    }

    static def AmbiguityCase(Request request, Response response) {
        response.type("application/json");
        def ambiguityCase = new AmbiguityCase(request.queryParams("record1_id"), request.queryParams("record2_id"))
        return JsonOutput.toJson([ambiguities:ambiguityCase.ambiguities, record1: ambiguityCase.record1, record2:ambiguityCase.record2 ])
    }


}
