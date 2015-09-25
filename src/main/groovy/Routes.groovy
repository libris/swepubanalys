import static spark.Spark.*
import spark.servlet.SparkApplication
import spark.template.mustache.MustacheTemplateEngine
import spark.ModelAndView
import spark.Request
import spark.Response


/**
 * Created by Theodor on 2015-09-09.
 * Hanldes Routing in the application.
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
        get("/uttag-av-data", { req, res -> index(req, res) }, templateEngine);
        post("/uttag-av-data/", { req, res -> index(req, res) }, templateEngine);
        get("/", { req, res -> index(req, res) }, templateEngine);
        post("/ladda-ner-fil", { req, res -> preview(req, res) }, templateEngine);
        post("/api/1.0/sparql", { req, res -> sparql(req, res) })
        get("/api/1.0/sparql", { req, res -> sparql(req, res) })
        get("/form", { req, res -> form(req, res) })
    }

    private static ModelAndView index2(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("pageTitle", "Nytt formulär");
        new ModelAndView(map, "form.mustache");
    }

    private static ModelAndView index(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("pageTitle", "Uttag av data");
        new ModelAndView(map, "index.mustache");
    }

    private static ModelAndView preview(final Request request, final Response response){
        final Map map = new HashMap();
        def a = request.queryParams();
        final Map queryParms = request.queryParams().collectEntries {
            it -> it.endsWith(']') ? [it.substring(0, it.length() - 2), request.queryParamsValues(it).join(',')] : [it, request.queryParams(it)]
        };
        map.put("queryParms", queryParms)
        map.put("pageTitle", "Ladda ned fil");
        new ModelAndView(map, "preview.mustache");
    }

    static sparql(Request request, Response response) {
        def query = request.queryParams("query");
        def format = request.queryParams("format");

        def resp = new SparqlEndPoint().post(query, format)
        response.type(format);
        return resp;
    }


}