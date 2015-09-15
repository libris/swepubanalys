import spark.ModelAndView
import spark.servlet.SparkApplication
import spark.template.mustache.MustacheTemplateEngine
import spark.ModelAndView
import spark.Request
import spark.Response
import spark.Route
import static spark.Spark.*


/**
 * Created by Theodor on 2015-09-09.
 */
public class Routes implements SparkApplication {
    private final static MustacheTemplateEngine templateEngine = new MustacheTemplateEngine();

    @Override
    void init() {
        //port(8080);
        staticFileLocation("/public");
        get("/uttag-av-data", { req, res -> index(req, res) }, templateEngine);
        get("/", { req, res -> index(req, res) }, templateEngine);
        post("/ladda-ner-fil", { req, res -> preview(req, res) }, templateEngine);

    }

    private static ModelAndView index(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("message", "hello");
        map.put("name", "Theodor");
        map.put("pageTitle", "Uttag av data");
        new ModelAndView(map, "index.mustache");
    }

    private static ModelAndView preview(final Request request, final Response response){
        final Map map = new HashMap();
        final Map queryParms = request.queryParams().collectEntries {
            it->it.endsWith("[]") ? [it.replace("[]",""), request.queryParams(it)] : [it, request.queryParams(it)]
        };
        map.put("queryParms", queryParms)
        map.put("message", "hello");
        map.put("name", "Theodor");
        map.put("pageTitle", "Ladda ned fil");
        new ModelAndView(map, "preview.mustache");
    }


}
