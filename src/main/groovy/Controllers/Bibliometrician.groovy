package Controllers

import static java.util.UUID.randomUUID
import spark.Request
import spark.Response

/**
 * Created by Theodor on 2015-10-01.
 */
class Bibliometrician {

    static Map index(final Request request, final Response response) {
        URL url = Bibliometrician.getClassLoader().getResource("config.groovy");
        def config = new ConfigSlurper().parse(url)
        final Map map = new HashMap();
        map.put("cacheBustingUid",config.buildStamp)
        map.put("pageTitle","SIDTITEL");
        return map;

    }


}
