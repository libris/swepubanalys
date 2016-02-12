package Doers

import Clients.Virtuoso
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

class Deduplicator {
    static String prefix = """PREFIX swpa_d: <http://swepub.kb.se/SwePubAnalysis/data#>
                    PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>
                    PREFIX mods_d: <http://swepub.kb.se/mods/data#>
                    PREFIX admin: <http://owl.hs.com/SemDW/admin_data#>"""
    static String mods_data_ns = "http://swepub.kb.se/mods/data#"
    static String mURIadjudicationGraph = "http://swepub.kb.se/analysis/adjudication/data#graph"

    static
    def saveDuplicateCase(boolean samePublication, String uriRecord1, String uriRecord2, String comment, String userId) {
        //TODO: requires logged in user
        def config = new ConfigSlurper().parse(this.getClassLoader().getResource("config.groovy"))
        //TODO:Check if this needs to be a local user
        VirtGraph graph = getGraph(config.virtuoso.jdbcUser.confic.virtuoso.jdbcPwd);
        String uri = "swpa_d:Adjudication__" + uriRecord1.substring(31, 1000) + "_" + uriRecord2.substring(31, 1000) + "_" + userId;
        String time = "\"${convertDateToXMLType(new Date(System.currentTimeMillis()))} \"^^<http://www.w3.org/2001/XMLSchema#dateTime>"
        String sparqlTemplate = """${prefix}
                                        INSERT INTO <${mURIadjudicationGraph}>
                                        {
                                            a swpa_m:Adjudication .
                                            a swpa_m:__TYPE__ .
                                            swpa_m:isDuplicate '__BOOL__'^^xsd:boolean .
                                            swpa_m:compares <${uriRecord1}"> .
                                            swpa_m:compares <${uriRecord2}"> .
                                            admin:userName \"${userId}\"^^xsd:string .
                                            swpa_m:validAt ${time} .
                                            uri + " rdfs:comment \"${comment}\" .
                                        } WHERE { }""";
        String sparql;
        try {
            String uriadj = uri.replace("swpa_d:Adjudication__", "swpa_d:CreativeWorkInstanceDuplicateAdjudication__");
            // First delete exists
            String deleteQuery = """${prefix}
                                            DELETE FROM <${mURIadjudicationGraph}>
                                            { ${uriadj} ?p ?o }
                                            WHERE { ${uriadj}?p ?o . }"""
            VirtuosoUpdateRequest vur = VirtuosoUpdateFactory.create(deleteQuery, graph);
            vur.exec();
            // Insert
            sparql = sparqlTemplate.replace("__TYPE__", "CreativeWorkInstanceDuplicateAdjudication");
            sparql = sparql.replace("swpa_d:Adjudication__", "swpa_d:CreativeWorkInstanceDuplicateAdjudication__");
            sparql = sparql.replace("__BOOL__", samePublication.toString());
            vur = VirtuosoUpdateFactory.create(sparql, graph);
            vur.exec();
        }
        catch (All) {
            throw All
        }
    }

    static VirtGraph getGraph(String user, String pw) {
        def config = new ConfigSlurper().parse(this.getClassLoader().getResource("config.groovy"))
        String url = "jdbc:virtuoso://${config.virtuoso.jdbcConn}/charset=UTF-8/log_enable=2";
        VirtGraph virtGraph = null;
        try {
            virtGraph = new VirtGraph(null, url, user, pw, true);
            virtGraph.setReadFromAllGraphs(true)
        }
        catch (All) {
        }
        return virtGraph;
    }

    static String getIdentifierValue(String uriRecord) {
        def config = new ConfigSlurper().parse(this.getClassLoader().getResource("config.groovy"))
        VirtGraph graph = getGraph(config.virtuoso.jdbcUser, config.virtuoso.jdbcPwd);
        ResultSet rs;
        String sparql;
        String sparqlTemplate = """
                                PREFIX mods_m: <http://swepub.kb.se/mods/model#>
                                SELECT DISTINCT ?_identifierValue WHERE {
                                FILTER ( ?Record = <_RECORD_URI_>)
                                ?Record a mods_m:Record .
                                ?Record mods_m:hasMetadata ?Metadata .
                                ?Metadata mods_m:hasMods ?Mods .
                                ?Mods mods_m:hasIdentifier ?Identifier .
                                ?Identifier a mods_m:Identifier .
                                ?Identifier mods_m:type ?_type .
                                ?Identifier mods_m:identifierValue ?_identifierValue .
                                ?Identifier mods_m:type "uri"^^xsd:string .}""";
        sparql = sparqlTemplate.replace("_RECORD_URI_", mods_data_ns + uriRecord);
        QueryExecution qe = VirtuosoQueryExecutionFactory.create(sparql, graph);
        try {
            rs = qe.execSelect();
            QuerySolution qs = rs.next();
            return qs.getLiteral("_identifierValue").getLexicalForm();
        } catch (All) {
            return ""
        }
    }
    //TODO: user must be logged in
    static ArrayList getPreviouslyAdjudicated(String uriRecord1, String uriRecord2) {
        def config = new ConfigSlurper().parse(this.getClassLoader().getResource("config.groovy"))
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
        VirtGraph graph = getGraph(config.virtuoso.jdbcUser.confic.virtuoso.jdbcPwd);
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
                        id2: it["_identifierValue2"].value,
                        isDuplicate: it["_isDuplicate"].value,
                        comment: it["_comment"].value,
                        org1 : it["_recordContentSourceValue1"].value,
                        org2: it["_recordContentSourceValue2"].value,
                        userName: it["_userName"].value



                ]
            }
        }
        catch(all){
            return []
        }
    }
}