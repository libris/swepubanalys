import controllers.*
import controllers.APIs.Deduplicator
import controllers.APIs.InputValidator
import spark.ModelAndView
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

        get("/bibliometri", { req, res -> new ModelAndView(Bibliometrician.index(req, res), "bibliometrician.mustache") }, templateEngine)
        get("/databearbetning", { req, res -> new ModelAndView(Inspector.index(req, res), "inspector.mustache") }, templateEngine)
        get("/secure", { req, res -> Security.index(req, res) }, templateEngine)
        get("/logout", { req, res -> controllers.APIs.Security.logout(req, res) })


        //<editor-fold desc="Redirects">
        get("/", { req, res -> res.redirect("/bibliometri") })
        get("/bibliometriker", { req, res -> res.redirect("/bibliometri") })
        get("/form", { req, res -> res.redirect("/bibliometri") })
        get("/granskare", { req, res -> res.redirect("/databearbetning") })
        get("/qf/bibliometrics", { req, res -> res.redirect("/bibliometri") })
        //</editor-fold>


        //<editor-fold desc="REST-APIs">
        post("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        post("/api/2.0/deduplication/adjudicate", { req, res -> Deduplicator.adjudicate(req, res) })
        get("/api/2.0/deduplication/adjudicate", { req, res -> Deduplicator.getPreviouslyAdjudicated(req, res) })
        get("/api/2.0/publicationYearSpan", { req, res -> InputValidator.publicationYearSpan(res) })
        get("/api/2.0/dataqualityvalidations", { req, res -> Api.getDataQualityViolations(res) })
        get("/api/2.0/elastic/stats", { req, res -> Api.getStats(res) })
        get("/api/2.0/elastic/aggregations", { req, res -> Api.getAggregations(req, res) })
        get("/api/2.0/validate/orcid", { req, res -> InputValidator.validateOrcid(req, res); })
        get("/api/2.0/data/query", { req, res -> Api.dataQuery(req, res) })
        post("/api/2.0/data/query", { req, res -> Api.dataQuery(req, res) })
        get("/api/2.0/ambiguity/case", { req, res -> Api.ambiguityCase(req, res) })
        get("/api/2.0/security", { req, res -> controllers.APIs.Security.getLoginStatus(req, res) })

        get("/api/2.0/technicalInfo", { req, res -> Api.getTechnicalInfo(res) })
        //</editor-fold>

        /**
         * Custom 500 Stub
         */
        exception(Exception, { e, request, response ->
            response.body(e.message + e.stackTrace);
        })
    }


}