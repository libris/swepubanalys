package Doers

import Clients.Virtuoso
import Traits.ConfigConsumable
import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.query.QuerySolution
import com.hp.hpl.jena.query.ResultSet
import virtuoso.jena.driver.VirtGraph
import virtuoso.jena.driver.VirtuosoQueryExecutionFactory
import virtuoso.jena.driver.VirtuosoUpdateFactory
import virtuoso.jena.driver.VirtuosoUpdateRequest

import java.text.SimpleDateFormat

/**
 * Created by Theodor on 2016-01-08.
 */

class Deduplicator implements ConfigConsumable {

    static String createAdjudicationUri(String uriRecord1, String uriRecord2){
        return "swpa_d:CreativeWorkInstanceDuplicateAdjudication__" + uriRecord1.substring(31, uriRecord1.length()) + "_" + uriRecord2.substring(31, uriRecord2.length())

    }

    static String prefix = """PREFIX swpa_d: <http://swepub.kb.se/SwePubAnalysis/data#>
                    PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>
                    PREFIX mods_d: <http://swepub.kb.se/mods/data#>
                    PREFIX admin: <http://owl.hs.com/SemDW/admin_data#>"""
    static String mods_data_ns = "http://swepub.kb.se/mods/data#"
    static String mURIadjudicationGraph = "http://swepub.kb.se/analysis/adjudication/data#graph"

    static void removeDuplicateCase(String uriRecord1, String uriRecord2, VirtGraph graph) {
        try {
            //TODO: requires logged in user
            assert graph != null
            String uriadj = createAdjudicationUri(uriRecord1,uriRecord2)

            String deleteQuery = """${prefix}
                                    DELETE FROM <${mURIadjudicationGraph}>
                                    { ${uriadj} ?p ?o }
                                    WHERE { ${uriadj} ?p ?o . }"""
            VirtuosoUpdateRequest vur = VirtuosoUpdateFactory.create(deleteQuery, graph);
            vur.exec();
        }
        catch (All) {
            throw All
        }
    }

    static
    void saveDuplicateCase(boolean samePublication, String uriRecord1, String uriRecord2, String comment, String userId, VirtGraph graph) {
        //TODO: requires logged in user
        assert graph != null
        //TODO:Check if this needs to be a local user
        String uri = createAdjudicationUri(uriRecord1,uriRecord2)
        String time = "\"${convertDateToXMLType(new Date(System.currentTimeMillis()))} \"^^<http://www.w3.org/2001/XMLSchema#dateTime>"
        String sparqlTemplate = """${prefix}
                                        INSERT INTO <${mURIadjudicationGraph}>
                                        {
                                            ${uri} a swpa_m:Adjudication .
                                            ${uri} a swpa_m:__TYPE__ .
                                            ${uri} swpa_m:isDuplicate '__BOOL__'^^xsd:boolean .
                                            ${uri} swpa_m:compares <${uriRecord1}> .
                                            ${uri} swpa_m:compares <${uriRecord2}> .
                                            ${uri} admin:userName \"${userId}\"^^xsd:string .
                                            ${uri} swpa_m:validAt ${time} .
                                            ${uri} rdfs:comment \"${comment}\" .
                                        } WHERE { }""";
        String sparql;
        try {
            removeDuplicateCase(uriRecord1,uriRecord2, graph)
            sparql = sparqlTemplate.replace("__TYPE__", "CreativeWorkInstanceDuplicateAdjudication");
            sparql = sparql.replace("swpa_d:Adjudication__", "swpa_d:CreativeWorkInstanceDuplicateAdjudication__");
            sparql = sparql.replace("__BOOL__", samePublication.toString());
            VirtuosoUpdateRequest vur = VirtuosoUpdateFactory.create(sparql, graph);
            vur.exec();
        }
        catch (All) {
            throw All
        }
    }

    static VirtGraph getGraph(String user, String pw) {
        String url = "jdbc:virtuoso://${currentConfig().virtuoso.jdbcConn}/charset=UTF-8/log_enable=2";
        VirtGraph virtGraph = null;
        try {
            virtGraph = new VirtGraph(null, url, user, pw, true);
            virtGraph.setReadFromAllGraphs(true)
        }
        catch (All) {
        }
        return virtGraph;
    }

    //TODO: user must be logged in
    static ArrayList getPreviouslyAdjudicated(String uriRecord1, String uriRecord2, VirtGraph graph = null) {
        if (!graph) {
            graph = getGraph(currentConfig().virtuoso.jdbcUser, currentConfig().virtuoso.jdbcPwd);
        }
        String sparql = """PREFIX mods_m: <http://swepub.kb.se/mods/model#>
                        PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>
                        SELECT DISTINCT ?Is_same_publication ?Is_same_creative_work xsd:date(?time) as ?when ?adjudicator WHERE {
                        {
                        ?CreativeWorkDuplicateAdjudication a swpa_m:CreativeWorkInstanceDuplicateAdjudication .
                        ?CreativeWorkDuplicateAdjudication swpa_m:isDuplicate ?Is_same_publication .
                        ?CreativeWorkDuplicateAdjudication <http://owl.hs.com/SemDW/admin_data#userName> ?adjudicator .
                        ?CreativeWorkDuplicateAdjudication swpa_m:validAt ?time .
                        ?CreativeWorkDuplicateAdjudication swpa_m:compares <${uriRecord1}> .
                        ?CreativeWorkDuplicateAdjudication swpa_m:compares <${uriRecord2}> .
                        }
                        }"""

        QueryExecution qe = VirtuosoQueryExecutionFactory.create(sparql, graph);
        def result = []
        ResultSet rs = qe.execSelect();
        while (rs.hasNext()) {
            QuerySolution qs = rs.next();
            String s2 = null;
            result << qs.getLiteral("Is_same_publication") ?
                    [sameAs     : qs.getLiteral("Is_same_publication").getLexicalForm(),
                     date       : qs.getLiteral("when").getLexicalForm(),
                     adjudicator: qs.getLiteral("adjudicator").getLexicalForm()] :
                    [error: "Result is null"]
        }
        return result
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

    static List getPreviouslyAdjudicated(String organization = "") {
        try {
            def sparql = Thread.currentThread().getContextClassLoader().getResource("sparqlQueries/previouslyAdjudicated.sparql").getText();
            sparql = organization ? sparql.replace("#!!orgFilter!!", "").replace("!!Org!!", organization) : sparql
            def resp = new Virtuoso().post(sparql, "application/json")
            return resp.results.bindings.collect { it ->
                [
                        adjudication: it["CreativeWorkInstanceDuplicateAdjudication"].value,
                        id1         : it["_identifierValue1"].value,
                        id2         : it["_identifierValue2"].value,
                        isDuplicate : it["_isDuplicate"].value,
                        comment     : it["_comment"].value,
                        org1        : it["_recordContentSourceValue1"].value,
                        org2        : it["_recordContentSourceValue2"].value,
                        userName    : it["_userName"].value,
                        record1     : it["Record1"].value,
                        record2     : it["Record2"].value
                ]
            }
        }
        catch (all) {
            return []
        }
    }
}