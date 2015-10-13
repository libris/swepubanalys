package Controllers

import spark.ModelAndView
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-10-01.
 */
class Form {

    static Map index(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("pageTitle", "Uttag av data");
        new ModelAndView(map, "form.mustache");
    }


}
