package Controllers

import spark.Request
import spark.Response

/**
 * Created by jimber on 2015-10-20.
 */
class Inspector {
    static Map index(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("pageTitle", "SIDTITEL");

    }

}
