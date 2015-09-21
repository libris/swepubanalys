import groovy.json.JsonOutput
import spark.servlet.SparkApplication
import spark.template.mustache.MustacheTemplateEngine
import spark.ModelAndView
import spark.Request
import spark.Response
import static spark.Spark.*

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
        //port(8080);
        staticFileLocation("/public");
        get("/uttag-av-data", { req, res -> index(req, res) }, templateEngine);
        get("/", { req, res -> index(req, res) }, templateEngine);
        post("/ladda-ner-fil", { req, res -> preview(req, res) }, templateEngine);
        post("/api/1.0/sparql", { req, res -> sparql(req, res) })

    }

    static String sparql(Request request, Response response) {
        final Map map = new HashMap();
        final Map queryParms = request.queryParams().collectEntries {
            it -> [it, request.queryParamsValues(it)]
        };
        map.put("queryParms", queryParms)
        String s = JsonOutput.prettyPrint(JsonOutput.toJson(map))
        return s;
    }

    private static ModelAndView index(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("pageTitle", "Uttag av data");
        new ModelAndView(map, "index.mustache");
    }

    private static ModelAndView preview(final Request request, final Response response){
        final Map map = new HashMap();
        final Map queryParms = request.queryParams().collectEntries {
            it -> [it, request.queryParamsValues(it)]
        };
        map.put("queryParms", queryParms)
        map.put("pageTitle", "Ladda ned fil");
        new ModelAndView(map, "preview.mustache");
    }




}