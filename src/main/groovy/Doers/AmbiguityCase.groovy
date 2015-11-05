package Doers

import Clients.Virtuoso

/**
 * Created by Theodor on 2015-11-04.
 */
class AmbiguityCase {
    def ambiguities
    def record1
    def record2

    def AmbiguityCase(String record1Id, String record2Id) {
        //def sparqlEndpoint = Virtuoso.VirtuosoRESTClient();
        def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/AmbiguityCase.sparql").getText();
        //def formatSparql = { String rec1Id, String rec2Id -> sparql }

        def ambiguityQuery = sparql.replace('!!rec1Id!!', record1Id).replace('!!rec2Id!!', record2Id) //formatSparql(record1Id, record2Id)
        //def gs = Eval.me('"${formatSparql}"')
        //assert gs instanceof GString
        //println gs
        def contentType = "application/json"
        def resp = new Virtuoso().post(ambiguityQuery, contentType)
        ambiguities = resp.results.bindings.collect { it ->
            [
                    type         : it["_ambiguityType"].value,
                    comment      : it["_comment"].value,
                    violatingData: it["_violatingData"].value
            ]
        }
        record1 = resp.results.bindings.collect { it ->
            [
                    org      : it["_orgCode1"].value,
                    uri: it["_uri1"].value
            ]
        }.first()
        record2 = resp.results.bindings.collect { it ->
            [
                    org      : it["_orgCode2"].value,
                    uri: it["_uri2"].value
            ]
        }.first()


    }
}