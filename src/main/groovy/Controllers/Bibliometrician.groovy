package controllers

import traits.Controller
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-10-01.
 */
class Bibliometrician implements Controller {

    static Map index(final Request request, final Response response) {
         final Map map = new HashMap();
        map["cacheBustingUid"] = currentConfig().buildStamp
        //noinspection GroovyMapPutCanBeKeyedAccess
        map["pageTitle"] = "SIDTITEL";
        return map;

    }


}
