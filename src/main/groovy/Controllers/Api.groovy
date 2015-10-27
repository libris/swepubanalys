package Controllers

import Clients.Elasticsearch
import Clients.FTP
import Clients.Virtuoso
import Validators.OrcidValidator
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import spark.Request
import spark.Response
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.*
import groovy.util.logging.Slf4j

/**
 * Created by Theodor on 2015-10-01.
 */
@Slf4j
class Api {
    static sparql(Request request, Response response) {
        def query = request.queryParams("query");
        def format = request.queryParams("format");
        def resp = new Virtuoso().post(query, format)
        response.type(format);
        return resp;
    }

    static publicationYearSpan(Response response) {
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/swepubPublicationYearLimits.sparql").getText();
        def resp = new Virtuoso().post(sparql, "application/json");
        final Map map = new HashMap();
        map.put("min", ((String)resp.results.bindings["callret-0"].value[0]).toInteger());
        map.put("max",((String)resp.results.bindings["callret-1"].value[0]).toInteger())
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

    static def validateBibliometricModel(Request request, Response response) {
        def model = new JsonSlurper().parseText(request.queryParams("model"))
        model.orcid.validateResult = validateOrcid(model.orcid)
        model.to.validateResult
        return JsonOutput.toJson(model);
    }



    static validateOrcid(Request request, Response response) {
        def orcid = request.queryParams("orcid");
        response.type("application/json");
        return JsonOutput.toJson(OrcidValidator.validateOrcid(orcid));

    }

    static def dataQuery(Request request, Response response) {
        def ftpClient = new FTP();
        String fileName = ftpClient.startQueryAndDownload(request.queryParams("query"), request.queryParams("format"));
        response.type("application/json");
        return  fileName;
    }
}
