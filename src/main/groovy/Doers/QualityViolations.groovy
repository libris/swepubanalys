package doers

import clients.Virtuoso

/**
 * Created by Theodor on 2016-02-12.
 */
class QualityViolations {
    static Map getQualityViolations() {
        try {
            def sparql = Thread.currentThread().contextClassLoader.getResource("sparqlQueries/DataQualityViolation.sparql").text;
            def resp = new Virtuoso().post(sparql, "application/json");
            return [values: resp.results.bindings.collect {
                it ->
                    [name    : it["_label"].value,
                     comment : it["_comment"].value,
                     severity: it["_severity"].value]
            }]
        }
        catch (all) {
            return [values: []]
        }
    }

}
