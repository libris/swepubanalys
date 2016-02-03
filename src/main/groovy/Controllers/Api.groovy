package Controllers

import Clients.Elasticsearch
import Clients.GitHub
import Clients.Virtuoso
import Doers.AmbiguityCase
import Doers.SparqlResultExporter
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import spark.Request
import spark.Response

/**
 * This class sits between Route configuration and actual testable use case code (Doers) for the API parts of the system
 */
@Slf4j
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
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/DataQualityViolation.sparql").getText();
        def resp = new Virtuoso().post(sparql, "application/json");
        def map = [values: resp.results.bindings.collect { it -> [name: it["_label"].value, comment: it["_comment"].value, severity: it["_severity"].value] }]
        response.type("application/json");
        return new JsonBuilder(map).toPrettyString()

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
        def exporter = new SparqlResultExporter();
        response.type("application/json");
        return exporter.startQueryAndDownload(request.queryParams("query"), request.queryParams("format"), request.queryParams("email"), request.queryParams("zip") == "true");

    }

    static AmbiguityCase(Request request, Response response) {
        response.type("application/json");
        def ambiguityCase = new AmbiguityCase(request.queryParams("record1_id"), request.queryParams("record2_id"), request.queryParams("record1_org"), request.queryParams("record2_org"))
        return JsonOutput.toJson([ambiguities: ambiguityCase.ambiguities, record1: ambiguityCase.record1, record2: ambiguityCase.record2])
    }

    static getTechnicalInfo(Request request, Response response) {
        response.type("application/json")
        def lastIndexDate = Virtuoso.lastIndexDate

        def latestRelease = [
                tag         : GitHub.releases?.first()?.tag_name ?: "",
                name        : GitHub.releases?.first()?.name ?: "",
                published_at: GitHub.releases?.first()?.published_at ?: "",
                body        : GitHub.releases?.first()?.body ?: ""]
        def allReleases = GitHub.releases.collect { it ->
            [tag         : it?.tag_name ?: "",
             name        : it?.name ?: "",
             published_at: it?.published_at ?: "",
             url         : it?.url ?: ""]
        }


        def mapToReturn = [lastIndexDate: lastIndexDate, latestRelease: latestRelease, allReleases: allReleases]
        return new JsonBuilder(mapToReturn).toPrettyString()
    }
}
