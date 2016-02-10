package Controllers

import Traits.ConfigConsumable
import spark.Request
import spark.Response

import static java.util.UUID.randomUUID

/**
 * Created by jimber on 2015-10-20.
 */
class Inspector implements ConfigConsumable  {
    static Map index(final Request request, final Response response) {
        final Map map = new HashMap();
        map.put("pageTitle", "SIDTITEL");
        map.put("cacheBustingUid",currentConfig().buildStamp)
        return map
    }

}
