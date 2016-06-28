package doers

import clients.Virtuoso
import domain.DuplicateCase
import groovy.util.logging.Log4j
import traits.ConfigConsumable
import virtuoso.jena.driver.VirtGraph
import virtuoso.jena.driver.VirtuosoUpdateFactory
import virtuoso.jena.driver.VirtuosoUpdateRequest

import java.text.SimpleDateFormat
/**
 * Created by Theodor on 2016-01-08.
 */
@Log4j
class Deduplicator implements ConfigConsumable {

    static String createAdjudicationUri(String uriRecord1, String uriRecord2) {
        return "swpa_d:CreativeWorkInstanceDuplicateAdjudication__${uriRecord1.substring(31, uriRecord1.length())}_${uriRecord2.substring(31, uriRecord2.length())}"
    }

    static String prefix = """PREFIX swpa_d: <http://swepub.kb.se/SwePubAnalysis/data#>
                    PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>
                    PREFIX mods_d: <http://swepub.kb.se/mods/data#>
                    PREFIX admin: <http://owl.hs.com/SemDW/admin_data#>"""
    static String mods_data_ns = "http://swepub.kb.se/mods/data#"
    static String mURIadjudicationGraph = "http://swepub.kb.se/analysis/adjudication/data#graph"

    /**
     * Removes a duplicate case (adjudication) from the triple store.
     * @param uriRecord1
     * @param uriRecord2
     * @param graph
     */
    static void removeDuplicateCase(String uriRecord1, String uriRecord2, VirtGraph graph) {
        try {
            doers.Deduplicator.getPreviouslyAdjudicated()
                    .findAll { it -> [uriRecord1, uriRecord2].contains(it.record1) && [uriRecord1, uriRecord2].contains(it.record2) }
                    .each { it -> Deduplicator.removeDuplicateCase(it.adjudicationURI, graph) };
        }
        catch (any) {
            log.error any
            graph.close()
            throw any
        }
    }
    /**
     * Removes a duplicate case (adjudication) from the triple store.
     * @param adjudicationURI
     * @param graph
     */
    static void removeDuplicateCase(String adjudicationURI, VirtGraph graph) {
        try {
            //TODO: requires logged in user
            assert graph != null
            String deleteQuery = """${prefix}
                                    DELETE FROM <${mURIadjudicationGraph}>
                                    { <${adjudicationURI}> ?p ?o }
                                    WHERE { <${adjudicationURI}> ?p ?o . }"""
            VirtuosoUpdateRequest vur = VirtuosoUpdateFactory.create(deleteQuery, graph);
            vur.exec();
        }
        catch (any) {
            log.error any
            graph.close()
            throw any

        }
    }

    static void saveDuplicateCase(boolean isDuplicate, String uriRecord1, String uriRecord2, String comment, String userId, VirtGraph graph) {
        //TODO: requires logged in user
        assert graph != null && !graph.isClosed()
        //TODO:Check if this needs to be a local user
        String uri = createAdjudicationUri(uriRecord1, uriRecord2)
        String time = "\"${convertDateToXMLType(new Date(System.currentTimeMillis()))} \"^^<http://www.w3.org/2001/XMLSchema#dateTime>"
        String sparqlTemplate = """${prefix}
                                        INSERT INTO <${mURIadjudicationGraph}>
                                        {
                                            <${uri}> a swpa_m:Adjudication .
                                            <${uri}> a swpa_m:__TYPE__ .
                                            <${uri}> swpa_m:isDuplicate '__BOOL__'^^xsd:boolean .
                                            <${uri}> swpa_m:compares <${uriRecord1}> .
                                            <${uri}> swpa_m:compares <${uriRecord2}> .
                                            <${uri}> admin:userName \"${userId}\"^^xsd:string .
                                            <${uri}> swpa_m:validAt ${time} .
                                            <${uri}> rdfs:comment \"${comment}\" .
                                        } WHERE { }""";
        String sparql;
        try {
            removeDuplicateCase(uriRecord1, uriRecord2, graph)
            sparql = sparqlTemplate.replace("__TYPE__", "CreativeWorkInstanceDuplicateAdjudication");
            sparql = sparql.replace("swpa_d:Adjudication__", "swpa_d:CreativeWorkInstanceDuplicateAdjudication__");
            sparql = sparql.replace("__BOOL__", isDuplicate.toString());
            VirtuosoUpdateRequest vur = VirtuosoUpdateFactory.create(sparql, graph);
            vur.exec();

        }
        catch (any) {
            log.error any
            graph.close()
            throw any

        }
    }

    static VirtGraph getGraph(String user, String pw) {
        String url = "jdbc:virtuoso://${currentConfig().virtuoso.jdbcConn}/charset=UTF-8/log_enable=2";
        VirtGraph virtualGraph = null;
        try {
            virtualGraph = new VirtGraph(null, url, user, pw, true);
            virtualGraph.setReadFromAllGraphs(true)
        }
        catch (any) {
            log.error any
            if (virtualGraph != null && !virtualGraph.isClosed()) {
                virtualGraph.close()
            }
        }
        return virtualGraph;
    }

    static String convertDateToXMLType(Date date) {
        // xs:dateTime format yyyy-mm-ddThh:mm:ss
        String xsDateTime;
        SimpleDateFormat formatter;
        Locale currentLocale = Locale.getDefault();
        formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", currentLocale);
        xsDateTime = formatter.format(date);
        return xsDateTime;
    }

    /**
     * Returns all previously adjudications. Optionally filtered by organization.
     * @param organization filter
     * @return List<DuplicateCase> of all previously adjudications. Optionally filtered by organization.
     */
    static List<DuplicateCase> getPreviouslyAdjudicated(String organization = "") {
        try {
            def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/previouslyAdjudicated.sparql").getText();
            sparql = organization ? sparql.replace("#!!orgFilter!!", "").replace("!!Org!!", organization) : sparql
            def resp = new Virtuoso().post(sparql, "application/json")
            resp.results.bindings.collect { it ->
                new DuplicateCase([
                        adjudicationURI: it["CreativeWorkInstanceDuplicateAdjudication"].value,
                        id1            : it["_identifierValue1"].value,
                        id2            : it["_identifierValue2"].value,
                        isDuplicate    : it["_isDuplicate"].value as boolean,
                        comment        : it["_comment"].value,
                        org1           : it["_recordContentSourceValue1"].value,
                        org2           : it["_recordContentSourceValue2"].value,
                        userName       : it["_userName"].value,
                        record1        : it["Record1"].value,
                        record2        : it["Record2"].value
                ])
            }
        }
        catch (all) {
            log.error all
            []
        }
    }
}