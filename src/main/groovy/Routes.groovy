import controllers.*
import controllers.APIs.Deduplicator
import controllers.APIs.InputValidator
import spark.ModelAndView
import spark.Request
import spark.servlet.SparkApplication
import spark.template.mustache.MustacheTemplateEngine

import static spark.Spark.*

/**
 * Created by Theodor on 2015-09-09.
 * Handles Routing in the application.
 */
public class Routes implements SparkApplication {
    private final static MustacheTemplateEngine templateEngine = new MustacheTemplateEngine();

    public static void main(String[] args) {
        SparkApplication app = new Routes();
        app.init();
    }

    @Override
    void init() {
        staticFileLocation("/public")

        get("/uttag-av-data", { req, res -> Beta.index(req, res) }, templateEngine)
        post("/uttag-av-data/", { req, res -> Beta.index(req, res) }, templateEngine)
        post("/ladda-ner-fil", { req, res -> Beta.preview(req, res) }, templateEngine)

        get("/bibliometri", { req, res -> new ModelAndView(Bibliometrician.index(req, res), "bibliometrician.mustache") }, templateEngine)
        get("/databearbetning", { req, res -> new ModelAndView(Inspector.index(req, res), "inspector.mustache") }, templateEngine)
        get("/secure", { req, res -> Security.index(req, res) }, templateEngine)

        /**
         * Redirects
         */
        get("/", { req, res -> res.redirect("/bibliometri") })
        get("/bibliometriker", { req, res -> res.redirect("/bibliometri") })
        get("/form", { req, res -> res.redirect("/bibliometri") })
        get("/granskare", { req, res -> res.redirect("/databearbetning") })
        get("/qf/bibliometrics", { req, res -> res.redirect("/bibliometri") })

        /**
         * REST-APIs
         */
        post("/api/1.0/sparql", { req, res ->
            validateQueryParameters(['query', 'format'] as String[], req)
            Api.sparql(req, res)
        })
        get("/api/1.0/sparql", { req, res ->
            validateQueryParameters(['query', 'format'] as String[], req)
            Api.sparql(req, res)
        })
        post("/api/2.0/deduplication/adjudicate", { req, res ->
            validateQueryParameters(['recordId1', 'recordId2', 'sameOrDifferent'] as String[], req)
            validate((0..1).contains(req.queryParams("sameOrDifferent").toInteger()), 400, 'Value of sameOrDifferent must be 0 or 1')
            Deduplicator.adjudicate(req, res)
        })

        get("/api/2.0/deduplication/adjudicate", { req, res ->
            //TODO: if organization is set, check that it is an actual organizationcode...
            Deduplicator.getPreviouslyAdjudicated(req, res)
        })

        get("/api/2.0/publicationYearSpan", { req, res -> InputValidator.publicationYearSpan(res) })

        get("/api/2.0/dataqualityvalidations", { req, res -> Api.getDataQualityViolations(res) })

        get("/api/2.0/elastic/stats", { req, res -> Api.getStats(res) })

        get("/api/2.0/elastic/aggregations", { req, res ->
            validateQueryParameters(['model'] as String[], req)
            Api.getAggregations(req, res)
        })
        get("/api/2.0/validate/orcid", { req, res ->
            validateQueryParameters(['orcid'] as String[], req)
            InputValidator.validateOrcid(req, res);
        })
        get("/api/2.0/data/query", { req, res ->
            validateQueryParameters(['query', 'format', 'email', 'zip'] as String[], req)
            Api.dataQuery(req, res)
        })
        post("/api/2.0/data/query", { req, res ->
            validateQueryParameters(['query', 'format', 'email', 'zip']  as String[], req)
            Api.dataQuery(req, res)
        })
        get("/api/2.0/ambiguity/case", { req, res -> Api.ambiguityCase(req, res) })
        get("/api/2.0/security", { req, res -> controllers.APIs.Security.getLoginStatus(req, res) })
        get("/api/2.0/technicalInfo", { req, res -> Api.getTechnicalInfo(res) })

        /**
         * Custom 500 Stubb
         */
        exception(Exception, { e, request, response ->
            response.body(e.message + e.stackTrace);
        })
    }

    void validate(boolean criteria, int httpStatus, String message) {
        if (!criteria) {
            halt(httpStatus, message)
        }
    }

    void validateQueryParameters(String[] params, Request request) {
        params.each { it ->
            if (!request.queryParams(it)) {
                halt(400, "Parameter ${it} is missing")
            }
        }
    }


}