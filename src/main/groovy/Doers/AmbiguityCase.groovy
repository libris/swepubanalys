package doers

import clients.Virtuoso

/**
 * Created by Theodor on 2015-11-04.
 */
class AmbiguityCase {
    def ambiguities
    def record1
    def record2
    int hasAdjudication
    int isDuplicate
    Double matchWeight

    def AmbiguityCase(String record1Id, String record2Id, String record1Org, String record2Org) {
        def sparql = Thread.currentThread().contextClassLoader.getResource("sparqlQueries/ambiguityCaseAndAdjud.sparql").text;
        def binding = ["record1": record1Id, "record2": record2Id, "org1": record1Org, "org2": record2Org]
        def engine = new groovy.text.SimpleTemplateEngine()
        def template = engine.createTemplate(sparql).make(binding)
        def resp = new Virtuoso().post(template.toString(), "application/json")

        ambiguities = resp.results.bindings.collect { it ->
            [
                    type         : it["_ambiguityType"].value,
                    comment      : it["_comment"].value,
                    violatingData: it["_violatingData"].value
            ]
        }.unique(false){
            a,b ->
                (a.type <=> b.type) + (a.violatingData <=> b.violatingData)

        }
        matchWeight = resp.results.bindings
                .collect { it ->  Double.parseDouble(it["_total_match_weight"].value)}.first()

        hasAdjudication = resp.results.bindings
                .collect { it ->
            it["hasAdjudication"].value == '1' ? 1:0}.first()
        isDuplicate = hasAdjudication == 1 ?resp.results.bindings
                .collect { it ->  (it["_isDuplicate"] && it["_isDuplicate"]?.value ==1) ? 1: 0   }.first() : 0

        record1 = resp.results.bindings.collect { it ->
            def record = it["Record1"].value
            [
                    org      : record1Org,
                    uri: it["_uri1"].value,
                    Record: record.contains('http://swepub.kb.se/mods/data#') ? record : 'http://swepub.kb.se/mods/data#' + record
            ]
        }.sort{a,b ->
            int ca =  new URI(a.uri as String).getHost().contains(record1Org as String) || new URI(a.uri as String).getHost().contains(a.org as String)? -1 : 1
            int cb =  new URI(b.uri as String).getHost().contains(record1Org as String) || new URI(b.uri as String).getHost().contains(b.org as String)? -1 : 1
            return ca <=>cb
        }.first()
        record2 = resp.results.bindings.collect { it ->
            def record = it["Record2"].value
            [
                    org      : record2Org,
                    uri: it["_uri2"].value,
                    Record: record.contains('http://swepub.kb.se/mods/data#') ? record : 'http://swepub.kb.se/mods/data#' + record
            ]
        }.sort{a,b ->
            int ca =  new URI(a.uri as String).getHost().contains(record2Org as String) || new URI(a.uri as String).getHost().contains(a.org as String)? -1 : 1
            int cb =  new URI(b.uri as String).getHost().contains(record2Org as String) || new URI(b.uri as String).getHost().contains(b.org as String)? -1 : 1
            return ca <=>cb
        }.first()


    }
}
