package Controllers

import spark.Request
import spark.Response

import static java.util.UUID.randomUUID

/**
 * Created by jimber on 2015-10-20.
 */
class Inspector {
    static Map index(final Request request, final Response response) {
        URL url = Inspector.getClassLoader().getResource("config.groovy");
        def config = new ConfigSlurper().parse(url)
        final Map map = new HashMap();
        map.put("pageTitle", "SIDTITEL");
        map.put("cacheBustingUid",config.buildStamp)
        return map
    }

}
