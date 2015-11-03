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

    public static void main(String[] args){
        SparkApplication app = new Routes();
        app.init();
    }

    @Override
    void init() {
        staticFileLocation("/public");
        get("/logga-in", { req, res -> new ModelAndView(Security.Login(req, res), "Login.mustache")}, templateEngine)

        get("/uttag-av-data", { req, res -> Beta.index(req, res) }, templateEngine);
        post("/uttag-av-data/", { req, res -> Beta.index(req, res) }, templateEngine);
        get("/", { req, res -> Beta.index(req, res) }, templateEngine);
        post("/ladda-ner-fil", { req, res -> Beta.preview(req, res) }, templateEngine);
        post("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/form",{ req, res -> res.redirect("/bibliometriker")})
        get("/qf/bibliometrics",{ req, res -> res.redirect("/bibliometriker")} )
        get("/bibliometriker", { req, res -> new ModelAndView(Bibliometrician.index(req, res), "bibliometrician.mustache")}, templateEngine)
        get("/granskare", { req, res -> new ModelAndView(Inspector.index(req, res), "inspector.mustache")}, templateEngine)
        post("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/2.0/publicationYearSpan", { req, res -> Api.publicationYearSpan(res) })
        get("api/2.0/dataqualityvalidations",{ req, res -> Api.getDataQualityViolations(res) })
        get("/api/2.0/elastic/stats", { req, res -> Api.getStats(res) })
        get("/api/2.0/elastic/aggregations", { req, res -> Api.getAggregations(req, res) })
        get("api/2.0/validate/orcid",{ req, res -> Api.validateOrcid(req, res);})
        get("api/2.0/data/query",{req,res->Api.dataQuery(req,res)})
        post("api/2.0/data/query",{req,res->Api.dataQuery(req,res)})
    }












}