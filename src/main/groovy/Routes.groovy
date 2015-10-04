import Controllers.Api
import Controllers.Beta
import Controllers.Form

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
        get("/uttag-av-data", { req, res -> Beta.index(req, res) }, templateEngine);
        post("/uttag-av-data/", { req, res -> Beta.index(req, res) }, templateEngine);
        get("/", { req, res -> Beta.index(req, res) }, templateEngine);
        post("/ladda-ner-fil", { req, res -> Beta.preview(req, res) }, templateEngine);
        post("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/form", { req, res -> Form.index(req, res) }, templateEngine)
        get("/qf/bibliometrics", { req, res -> Form.index(req, res) }, templateEngine)
        post("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> Api.sparql(req, res) })
        get("/api/2.0/publicationYearSpan", { req, res -> Api.publicationYearSpan(req, res) })

    }










}