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
     * @return the concatenated results from all the requests        **/
    public getTurtle(String sparql, def orgCode = null) {
        //TODO: make more generic with more args. Rename orgCode
        //TODO: rename to something more apropiate
        try {
            def defaultLimit = 10000
            def defaultOffset = 0
            def defaultLimitClause = { int offset, int limit -> "\nOFFSET ${offset}  LIMIT ${limit}" }

            String sparqlString = orgCode == null ? sparql : sparql.replace('${orgCodeArg}', orgCode)
            def currentResponse
            def result = "";

            while (true) {
                currentResponse = makeSparqlRequest(sparqlString + defaultLimitClause(defaultOffset, defaultLimit))

                // if ((defaultOffset/defaultLimit) >2) //For debugging
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
    public makeSparqlRequest(def sparql, def sparqlEndPoint) {
        //TODO replace hardcoded server string with configuration

        RESTClient client = new RESTClient(sparqlEndPoint)
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
    public static expand(String turtle, String orgCode) {

        if (turtle == null) {
            return null;
        }

        try {
            return JsonLdProcessor.fromRDF(turtle,
                    [format: "text/turtle", useNativeTypes: true] as JsonLdOptions)

        }
        catch (All) {
            println All.message
            println All.stackTrace
            println "Turtle:\n" turtle;
            return null;
        }

    }
/**
 *
 * @param expando the expanded graph to compact
 * @param context file in JSONLD format.
 * @return comapacted graph
 * **/
    public static compact(def expando, def context, String orgCode) {
        if (expando == null) {
            return null;
        }
        try {
            return JsonLdProcessor.frame(expando, context, [embed: true] as JsonLdOptions)
        }
        catch (All) {
            println expando;
            println All.message
            println All.stackTrace
        }
    }

    /**
     *
     * @return all distinct org codes in the data
     */
    public static allOrgs(String sparqlEndpoint) {
        //TODO: replace hardcoded strings with configuration    or arguments
        String sparql = new File("sparqls/allOrgs.sparql").text
        def resp = postSparql(sparql, "application/json", sparqlEndpoint)
        return resp.results.bindings["callret-0"].value.collect { it }
    }
/**
 *
 * @return highest and lowest years in the dataset
 */
    public static publicationYearSpan() {
        //TODO: replace hardcoded strings with configuration or arguments
        String sparql = new File("sparqls/swepubPublicationYearLimits.sparql").text
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
            println sparql
            println All.message
            println All.stackTrace
        }
    }

    /**
     * Appends bulk import command lines to json documents that are about to be imported into elasticsearch and saves the commands to a file
     * @param fileName name of file
     * @param infoList list of json documents
     */
    public static void createElasticExport(def fileName, def infoList, String indexName, String typeName) {
        def insertCommand = { index, type, id ->
            """{ "create":  { "_index": "${index}", "_type": "${type}", "_id" : "${id}"}}}"""
        };
        def chunks = infoList.collate(2000)
        int i = 0;
        chunks.each { chunk ->
            i++;
            try {
                new File("${fileName}_${i}.json").withWriter { out ->
                    chunk.findAll { record -> record != null }.each { record ->
                        out.println insertCommand(indexName, typeName, record.hasMods.identifierValue)
                        out.println new JsonBuilder(record).toString();
                    }
                }
            }
            catch (All) {
                println All.message
                println All.stackTrace

            }
        }
    }

    public static sendToElastic(def infoList, String indexName, String typeName, String elasticEndPoint) {
        def insertCommand = { index, type, id ->
            """{ "create":  { "_index": "${index}", "_type": "${type}", "_id" : "${id}"}}}"""
        };
        def chunks = infoList.collate(2000)
        int i = 0;
        chunks.each { chunk ->
            i++;
            try {
                putToElastic(infoList.collect { record ->
                    insertCommand(indexName, typeName, record.hasMods.identifierValue)
                    +"\n"
                    +new JsonBuilder(record).toString();
                }.join("\n"),elasticEndPoint)
            }
            catch (All) {
                println All.message
                println All.stackTrace

            }
        }
    }

    public void putToElastic(String data, def elasticEndPoint) {
        RESTClient client = new RESTClient(elasticEndPoint)
        def response = client.put(
                path: '/',
                accept: ContentType.TEXT,

        ) { text data }
        assert 200 == response.statusCode
    }

    /**
     *
     * @param text turtle formatted data to be split
     * @return List of turtle objects with all name spaces attached
     */
    public static List splitTurtles(def text) {
        //TODO: make more generic
        try {
            def prefixes = ["@prefix foaf:\t<http://xmlns.com/foaf/0.1/> .",
                            "@prefix rdf:\t<http://www.w3.org/1999/02/22-rdf-syntax-ns#> .",
                            "@prefix rdfs:\t<http://www.w3.org/2000/01/rdf-schema#> ."];
            String record;
            def list = [];
            text.eachLine { line ->
                switch (line) {
                    case { it -> (it.startsWith("\t")) }:
                        record += line + "\n";
                        break;
                    case { it -> it.startsWith("@prefix ") && prefixes.contains(it) }:
                        break;
                    case { it -> it.startsWith("@prefix ") && !prefixes.contains(it) }:
                        prefixes.add(line)
                        break;
                    case { it -> it.startsWith("ns1:") && (it.endsWith("rdf:type\tns2:Mods .") || it.endsWith("rdf:type\tns2:Mods ;")) }:
                        if (record != null)
                            list.add(record)
                        record = line + "\n";
                        break;
                    case { it -> it.startsWith("ns") || it.startsWith("rdfs") }:
                        record = record ? record.replaceAll(/ *$/, '') : record
                        record = record && record.endsWith(";") ?
                                record.substring(0, record.length() - 1) + "." + line + "\n"
                                : record + line + "\n";
                        break;
                    default:
                        record += line + "\n";
                        println "Rad som inte konsumerats: \t" + line;
                }
            }
            list.add(record);
            return list.collect { it -> prefixes.join("\n") + "\n" + it };
        }
        catch (All) {
            println All.message
            println All.stackTrace
            throw All
        }
    }

    static Map getDataQualityViolations(String sparqlEndpoint) {
        String sparql = new File("sparqls/DataQualityViolation.sparql").text as String
        def resp = postSparql(sparql, "application/json", sparqlEndpoint)
        return [values: resp.results.bindings.collect { it -> [name: it["_label"].value, comment: it["_comment"].value, severity: it["_severity"].value] }]
    }

    def getCLISettings(args) {
        def cli = new CliBuilder(usage: 'showdate.groovy -[chflms] [SparqlEndpoint] [FileStore]')
        // Create the list of options.
        cli.with {
            h longOpt: 'help', 'Show usage information'
            //i longOpt: 'format-custom', args: 1, argName: 'format', 'Format date with custom format defined by "format"'
            i longOpt: 'index', 'Index into ElasticSearch'
            c longOpt: 'clear', 'Clear ElasticSearch prior to indexing'
        }
        def options = cli.parse(args)
        if (!options) {
            return
        }
        // Show usage text when -h or --help option is used.
        if (options.h) {
            cli.usage()
            return
        }

        // Determine formatter.
        def settings = [index: false, fileStore: '', clearIndex: false, sparqlEndpoint: '']
        if (options.i) {  // Using short option.
            settings.index = true
        }
        if (options.c) {
            settings.clearIndex = true
        }

        def extraArguments = options.arguments()
        if (extraArguments) {
            settings.fileStore = extraArguments[1]
            settings.sparqlEndpoint = extraArguments[0]
        }

        return settings
    }
}