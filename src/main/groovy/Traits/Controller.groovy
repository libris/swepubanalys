package Traits

/**
 * Created by Theodor on 2016-02-16.
 */
trait Controller implements ConfigConsumable {
    static void validate(Object result, String exceptionMessage,Integer httpStatusCode){
        if(!result) {
          halt(httpStatusCode,exceptionMessage)
        }
    }
}