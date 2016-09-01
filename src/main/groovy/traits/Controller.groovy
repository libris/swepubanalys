package traits

import spark.Request
import static spark.Spark.halt

/**
 * Created by Theodor on 2016-02-16.
 */
trait Controller implements ConfigConsumable {
    static void validate(boolean criteria, int httpStatus, String message) {
        if (!criteria) {
            halt(httpStatus, message)
        }
    }

    static void validateQueryParameters(String[] params, Request request) {
        params.each { it ->
            if (!request.queryParams(it)) {
                halt(400, "Parameter ${it} is missing")
            }
        }
    }
}