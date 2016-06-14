package Controllers

import Clients.Elasticsearch
import Clients.GitHub
import Clients.Virtuoso
import Doers.AmbiguityCase
import Doers.QualityViolations
import Doers.SparqlResultExporter
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import spark.Request
import spark.Response

/**
 * This class sits between Route configuration and actual testable use case code (Doers) for the API parts of the system
 */
@Slf4j
@CompileStatic
class Api {
    //TODO: Refactor so the methods are testable....

    static sparql(Request request, Response response) {
        println request.queryParams()
        def query = request.queryParams("query");
        def format = request.queryParams("format");

        def resp = new Virtuoso().post(query, format)
        response.type(format);
        return resp;
    }

    static getDataQualityViolations(Response response) {
        response.type("application/json");
        return new JsonBuilder(QualityViolations.qualityViolations).toPrettyString()

    }

    static getStats(Response response) {
        response.type("application/json");
        return Elasticsearch.getStats();
    }

    static getAggregations(Request request, Response response) {

        def model = request.queryParams("model") != null ? new JsonSlurper().parseText(request.queryParams("model")) : null;
        response.type("application/json");
        return Elasticsearch.getAggs(model);
    }

    static dataQuery(Request request, Response response) {
        response.type("application/json");
        def exporter = new SparqlResultExporter()
        return exporter.startQueryAndDownload(request.queryParams("query"), request.queryParams("format"), request.queryParams("email"), request.queryParams("zip") == "true");

    }

    static ambiguityCase(Request request, Response response) {
        response.type("application/json")
        def ambiguityCase = new AmbiguityCase(request.queryParams("record1_id"), request.queryParams("record2_id"), request.queryParams("record1_org"), request.queryParams("record2_org"))
        return JsonOutput.toJson([ambiguities: ambiguityCase.ambiguities, record1: ambiguityCase.record1, record2: ambiguityCase.record2])
    }

    static getTechnicalInfo(Request request, Response response) {
        response.type("application/json")
        def mapToReturn = [lastIndexDate: Virtuoso.lastIndexDate, releaseInfo: GitHub.releases, currentModsVersion: '2.6']
        return new JsonBuilder(mapToReturn).toPrettyString()
    }

}
