package Controllers

import Traits.ConfigConsumable
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-10-01.
 */
class Bibliometrician implements ConfigConsumable {

    static Map index(final Request request, final Response response) {
         final Map map = new HashMap();
        map.put("cacheBustingUid",currentConfig().buildStamp)
        map.put("pageTitle","SIDTITEL");
        return map;

    }


}
