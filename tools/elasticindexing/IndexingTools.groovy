@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.core.JsonLdOptions
import com.github.jsonldjava.core.JsonLdProcessor
import groovy.json.JsonBuilder
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-16.
 * Contains methods used by other scripts to compact virtuoso Construct statement results
 */
class IndexingTools {

    /**
     * Calls a sparql enpoind and downloads paged turtle results.
     * @param fileNameFrom file containing sparql query
     * @param orgCode organisation code to filter the Sparql query
     * @return the concatenated results from all the requests  **/
    public saveTurtle(def fileNameFrom, def orgCode = null) {
        //TODO: replace fileloading with string parameter
        //TODO: make more generic with more args. Rename orgCode
        //TODO: rename to something more apropiate
        try {
            def defaultLimit = 10000
            def defaultOffset = 0
            def defaultLimitClause = { int offset, int limit -> "\nOFFSET ${offset}  LIMIT ${limit}" }

            String sparqlString = orgCode == null ? new File(fileNameFrom).text : new File(fileNameFrom).text.replace('${orgCodeArg}', orgCode)
            def currentResponse
            def result = "";

            while (true) {
                currentResponse = makeSparqlRequest(sparqlString + defaultLimitClause(defaultOffset, defaultLimit))

                // if ((defaultOffset/defaultLimit) >2) //
                if (currentResponse.startsWith("# Empty TURTLE"))
                    break;
                else
                    result += currentResponse
                defaultOffset += defaultLimit
            }
            return result;

        }
        catch (All) {
            println All.message
            throw All
        }
    }
    /**
    * Makes request to a sparql endpoint
     *
     * @param sparql raw sparql query
     * @return the result in turtle format
     * **/
    public makeSparqlRequest(def sparql) {
        //TODO replace hardcoded server string with configuration

        RESTClient client = new RESTClient('http://virhp07.libris.kb.se/sparql')
        def response = client.post(
                accept: ContentType.TEXT,
                path: '/',
                query: [query: sparql, format: "text/turtle"])
        assert 200 == response.statusCode
        return response.text
    }

    /**
     *
     * @param turtle graph in turtle format to expand
     * @return the expanded turtle graph in JSONLD format
     */
    public static expand(String turtle) {
        if (turtle == null) {
            //println "null turtle"
            return null;
        }

        try {
            return JsonLdProcessor.fromRDF(turtle,
                    [format: "text/turtle", useNativeTypes: true] as JsonLdOptions)

        }
        catch (All) {
            println All.message
            println turtle;
            return null;
        }
    }
/**
 *
 * @param expando the expanded graph to compact
 * @param context file in JSONLD format.
 * @return comapacted graph
 * **/
    public static compact(def expando, def context) {
        if (expando == null) {
            //println "null expando"
            return null;
        }
        try {
            return JsonLdProcessor.frame(expando, context, [embed: true] as JsonLdOptions)
        }
        catch (All) {
            println All.message
            println expando;
            return null;
        }
    }

    /**
     *
     * @return all distinct org codes in the data
     */
    public static allOrgs() {
        //TODO: replace hardcoded strings with configuration    or arguments
        String sparql = new File("allOrgs.sparql").text
        def resp = postSparql(sparql, "application/json", "http://virhp07.libris.kb.se/sparql")
        return resp.results.bindings["callret-0"].value.collect { it }
    }
/**
 *
 * @return highest and lowest years in the dataset
 */
    public static publicationYearSpan() {
        //TODO: replace hardcoded strings with configuration or arguments
        String sparql = new File("swepubPublicationYearLimits.sparql").text
        def resp = postSparql(sparql, "application/json", "http://virhp07.libris.kb.se/sparql")
        final Map map = new HashMap();
        map.put("min", ((String) resp.results.bindings["callret-0"].value[0]).toInteger());
        map.put("max", ((String) resp.results.bindings["callret-1"].value[0]).toInteger())
        return map.min..map.max
    }
/**
 *
 * @param sparql the sparql query
 * @param contentType contenttype string
 * @return a sparql result
 */
    public static postSparql(String sparql, String contentType, String path) {
        //TODO: enable more content types
        try {
            RESTClient client = new RESTClient(path)
            def response = client.post(
                    accept: contentType == "application/json" ? ContentType.JSON : ContentType.TEXT,
                    path: '/',
                    query: [query: sparql, format: contentType])
            assert 200 == response.statusCode
            return contentType == "application/json" ? response.json : response.text;
        }
        catch (All) {
            println All.message
            println sparql
            throw All
        }
    }

    /**
     * Appends bulk import command lines to json documents that are about to be imported into elasticsearch and saves the commands to a file
     * @param fileName name of file
     * @param infoList list of json documents
     */
    public static void createElasticExport(def fileName, def infoList) {
        //TODO: make more generic/reusable
        def insertCommand = '{ "create":  { "_index": "swepub", "_type": "bibliometric"}}';
        try {
            new File(fileName).withWriter { out ->
                infoList.findAll { it -> it != null }.each {
                    out.println insertCommand
                    out.println new JsonBuilder(it).toString();
                }
            }
        }
        catch (All) {
            println All.message
            println All.stackTrace
            throw All
        }
    }

    /**
     *
     * @param text turtle formatted data to be split
     * @return List of turtle objects with all name spaces attached
     */
    public static List splitTurtles(def text) {
        try {
            def prefixes = ["@prefix\tfoaf:\t<http://xmlns.com/foaf/0.1/> ."];
            String record;
            def list = [];
            text.eachLine { line ->
                switch (line) {
                    case { it -> (it.startsWith("\tns") || it.startsWith("\trdfs") || it.startsWith("\t\t")) }:
                        record += line + "\n";
                        break;
                    case { it -> it.startsWith("@prefix ") && prefixes.contains(it) }:
                        break;
                    case { it -> it.startsWith("@prefix ") && !prefixes.contains(it) }:
                        prefixes.add(line)
                        break;
                    case { it -> it.startsWith("ns1:Mods__oai_") }:
                        list.add(record)
                        record = prefixes.join("\n") + "\n" + line + "\n";
                        break;
                    case { it -> it.startsWith("ns") || it.startsWith("rdfs") }:
                        record = record ? record.replaceAll(/ *$/, '') : record
                        record = record && record.endsWith(";") ?
                                record.substring(0, record.length() - 1) + "." + line + "\n"
                                : record + line + "\n";
                        break;
                    default:
                        print "\t" + line;
                }
            }
            return list;
        }
        catch (All) {
            println All.message
            println text
            throw All
        }
    }
}