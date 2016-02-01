import Controllers.APIs.InputValidator
import Controllers.Api
import Controllers.Beta
import Controllers.Bibliometrician
import Controllers.Inspector
import Controllers.Security
import spark.ModelAndView
import static spark.Spark.*
import spark.servlet.SparkApplication
import spark.template.mustache.MustacheTemplateEngine

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

        /**
         * Redirects
         */
        get("/", { req, res -> res.redirect("/bibliometri") })
        get("/bibliometriker", { req, res -> res.redirect("/bibliometri") })
        get("/form", { req, res -> res.redirect("/bibliometri") })
        get("/granskare", { req, res -> res.redirect("/databearbetning") })
        get("/logga-in", { req, res -> new ModelAndView(Security.Login(req, res), "Login.mustache") }, templateEngine)
        get("/qf/bibliometrics", { req, res -> res.redirect("/bibliometri") })

        /**
         * REST-APIs
         */
        post("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        post("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/2.0/publicationYearSpan", { req, res -> InputValidator.publicationYearSpan(res) })
        get("/api/2.0/dataqualityvalidations", { req, res -> Api.getDataQualityViolations(res) })
        get("/api/2.0/elastic/stats", { req, res -> Api.getStats(res) })
        get("/api/2.0/elastic/aggregations", { req, res -> Api.getAggregations(req, res) })
        get("/api/2.0/validate/orcid", { req, res -> InputValidator.validateOrcid(req, res); })
        get("/api/2.0/data/query", { req, res -> Api.dataQuery(req, res) })
        post("/api/2.0/data/query", { req, res -> Api.dataQuery(req, res) })
        get("/api/2.0/ambiguity/case", { req, res -> Api.AmbiguityCase(req, res) })

        /**
         * Custom 500 Stub
         */
        exception(Exception, {e, request, response ->
            response.body(e.message + e.stackTrace);
        })
    }


}