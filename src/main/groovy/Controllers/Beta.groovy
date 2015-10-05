package Controllers

import spark.ModelAndView
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-10-01.
 */
class Beta {

    static ModelAndView index(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("pageTitle", "Uttag av data");
        new ModelAndView(map, "index.mustache");
    }
     static ModelAndView preview(final Request request, final Response response){
        final Map map = new HashMap();
        final Map queryParms = request.queryParams().collectEntries {
            it -> it.endsWith(']') ? [it.substring(0, it.length() - 2), request.queryParamsValues(it).join(',')] : [it, request.queryParams(it)]
        };
        map.put("queryParms", queryParms)
        map.put("pageTitle", "Ladda ned fil");
        new ModelAndView(map, "preview.mustache");
    }


}