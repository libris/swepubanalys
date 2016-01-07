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
     * Calls a sparql endpoind and downloads paged turtle results.
     * @param fileNameFrom file containing sparql query
     * @param orgCode organisation code to filter the Sparql query
     * @return the concatenated results from all the requests                               **/
    static getTurtle(Map args) {
        //TODO: make more generic with more args. Rename orgCode
        //TODO: rename to something more apropiate
        assert args.elasticEndpoint
        assert args.fileStore

        try {
            def defaultLimit = 100000
            def prefixes = ["@prefix foaf:\t<http://xmlns.com/foaf/0.1/> .",
                            "@prefix rdf:\t<http://www.w3.org/1999/02/22-rdf-syntax-ns#> .",
                            "@prefix outt_m:\t<http://swepub.kb.se/SwePubAnalysis/OutputTypes/model#> .",
                            "@prefix rdfs:\t<http://www.w3.org/2000/01/rdf-schema#> ."];
            def defaultOffset = 0
            def totalJsons = 0
            def severityByViolationName = { String violationName -> [label: violationName, severity: (args.qualityViolations.values.find { tit -> tit.name == violationName }?.severity ?: "0").toInteger()] }
            def toSeconds = { long start, long stop -> Math.round(((stop - start) / 1000000000.0)) }
            def defaultLimitClause = { int offset, int limit -> "\nOFFSET ${offset}  LIMIT ${limit}" }

            String sparqlString = args.organisationCode == null ? args.sparqlQuery : args.sparqlQuery.replace('${orgCodeArg}', args.organisationCode)

            def currentResponse
            while (true) {
                long startTick = System.nanoTime();
                currentResponse = makeSparqlRequest(sparqlString + defaultLimitClause(defaultOffset, defaultLimit), args.sparqlEndpoint)
                if (currentResponse.startsWith("# Empty TURTLE")) {
                    break
                } else {
                    long fetchTick = System.nanoTime();
                    def turtles = splitTurtles(currentResponse, prefixes)//samma
                    def ttlCount = turtles.count { t -> t }
                    if (ttlCount == 1) {
                        println turtles[0]
                    }
                    long splitTick = System.nanoTime();
                    def compactos = turtles.collect { turtle -> compact(expand(turtle, args.organisationCode), args.context, args.organisationCode) }

                    def d = compactos.findAll { it != null }
                            .collect { compacto ->
                        return compacto != null ? compacto."@graph".find { args.graphFilter } : null
                    }

                    long compactTick = System.nanoTime();
                    def e = d.collect { record ->
                        if (record?.qualityName != null) {
                            def newStuff = (record.qualityName instanceof String) ?
                                    [severityByViolationName(record.qualityName as String)]
                                    : record.qualityName.collect { qualityName -> severityByViolationName(qualityName) }
                            record['qualityViolations'] = newStuff;
                        }
                        return record
                    }
                    handleJsons(e, args.batchName, "swepub", args.elasticType, args.index, args.fileStore, args.elasticEndpoint)
                    long postTick = System.nanoTime();
                    println "${new Date()} ${args.batchName} (${defaultOffset}) \t Turtles: ${ttlCount} Compactos: ${compactos.count { c -> c }} Jsons: ${d.count { j -> j }} \t Jsons2: ${e.count { j -> j }} \tRequest: ${toSeconds(startTick, fetchTick)}\t Split: ${toSeconds(fetchTick, splitTick)}\t Compact: ${toSeconds(splitTick, compactTick)} \t Post: ${toSeconds(compactTick, postTick)}"
                    totalJsons += d.count { j -> j }
                }
                defaultOffset += defaultLimit
            }
            println "${args.batchName} klar. Totalt antal poster: ${totalJsons}"
        }
        catch (All) {
            println "${All.message}\n====================\n ${All.stackTrace}"
        }


    }

    private static void handleJsons(List<Object> e,
                                    def batchName,
                                    def indexName, def typeName, def index, def fileStore, def elasticEndpoint) {
        if (index) {
            sendToElastic(e, indexName, typeName, elasticEndpoint)
        } else {
            createElasticExport("${fileStore}/${batchName}.json", e, indexName, typeName)
        }

    }

    /**
     * Makes request to a sparql endpoint
     *
     * @param sparql raw sparql query
     * @return the result in turtle format
     * **/
    static makeSparqlRequest(def sparql, def sparqlEndPoint) {
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
    static expand(String turtle, String orgCode) {
        assert turtle != null
        try {
            def result = JsonLdProcessor.fromRDF(turtle,
                    [format: "text/turtle", useNativeTypes: true] as JsonLdOptions)
            if (!result) {
                println "Felande turtle:\n ${turtle}"
            }
            return result

        }
        catch (All) {
            println All.message
            println All.stackTrace
            println "Turtle:\n" + turtle;
            return null;
        }

    }
/**
 *
 * @param expando the expanded graph to compact
 * @param context file in JSONLD format.
 * @return comapacted graph
 * **/
    static compact(def expando, def context, String orgCode) {
        if (expando == null) {
            return null;
        }
        try {
            def result = JsonLdProcessor.frame(expando, context, [embed: true] as JsonLdOptions)
            if (!result) {
                println "Felande expando:\n ${expando}"
            }
            return result
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
    static allOrgs(String sparqlEndpoint) {
        //TODO: replace hardcoded strings with configuration    or arguments
        String sparql = new File("sparqls/allOrgs.sparql").text
        def resp = postSparql(sparql, "application/json", sparqlEndpoint)
        return resp.results.bindings["callret-0"].value.collect { it }
    }

/**
 *
 * @param sparql the sparql query
 * @param contentType contenttype string
 * @return a sparql result
 */
    static postSparql(String sparql, String contentType, String path) {
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
    static void createElasticExport(def fileName, def infoList, String indexName, String typeName) {
        def insertCommand = { index, type, id ->
            """{ "create":  { "_index": "${index}", "_type": "${type}", "_id" : "${id}"}}}"""
        };
        def chunks = infoList.collate(2000)
        int i = 0;
        chunks.each { chunk ->
            i++;
            try {
                new File("${fileName}_${i}.json").withWriter { out ->
                    chunk.findAll { it?.identifierValue != null }.each { record ->
                        out.println insertCommand(indexName, typeName, record.identifierValue)
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

    static sendToElastic(def infoList, String indexName, String typeName, String elasticEndPoint) {
        assert infoList.any()
        def insertCommand = { index, type, id ->
            """{ "create":  { "_index": "${index}", "_type": "${type}", "_id" : "${id}"}}}"""
        };
        def chunks = infoList.collate(500)
        int i = 0;
        chunks.each { chunk ->
            i++;
            try {
                String data = chunk.findAll { it?.identifierValue != null }
                        .collect {
                    record ->
                        "${insertCommand(indexName, typeName, record.identifierValue)} \n ${new JsonBuilder(record).toString()}"
                }.join("\n") as String
                assert data instanceof String
                assert elasticEndPoint instanceof String
                putToElastic(elasticEndPoint, data)
            }
            catch (All) {
                println All.message + " sendToElastic: " + indexName + " " + typeName + " " + elasticEndPoint
                //println All.stackTrace

            }
        }
    }

    static void putToElastic(String elasticEndPoint, def path, def data) {
        RESTClient client = new RESTClient(elasticEndPoint)
        def response = client.put(
                path: path,
                accept: ContentType.TEXT,

        ) { text data }
        println response.statusMessage
        assert 200 == response.statusCode
    }

    static void removeFromElastic(String elasticEndPoint) {
        RESTClient client = new RESTClient(elasticEndPoint)
        def response = client.delete(
                path: '',
                accept: ContentType.TEXT,

        )
        println response.statusMessage
        assert 200 == response.statusCode
    }

    /**
     *
     * @param text turtle formatted data to be split
     * @return List of turtle objects with all name spaces attached
     */
    static splitTurtles(String text, ArrayList<String> prefixes) {
        //TODO: make more generic
        try {
            String record;
            def list = [];
            int i = 0;
            text.eachLine { line ->
                i++;
                switch (line) {
                    case { it -> (it.startsWith("\t")) }:
                        record += line + "\n";
                        break;
                    case { it -> it.startsWith("@prefix ") && prefixes.contains(it) }:
                        break;
                    case { it -> it.startsWith("@prefix ") && !prefixes.contains(it) }:
                        prefixes.add(line)
                        break;
                    case { it -> it.startsWith("ns1:") && (it.endsWith("rdf:type\tns2:Record .") || it.endsWith("rdf:type\tns2:Record ;")) }:
                        if (record != null)
                            list.add(record)
                        record = line + "\n"
                        break;
                    case { it -> it.startsWith("ns") || it.startsWith("rdfs") }:
                        record = record ? record.replaceAll(/ *$/, '') : record
                        record = record && record.endsWith(";") ?
                                record.substring(0, record.length() - 1) + "." + line + "\n"
                                : record + (line ?: "") + "\n";
                        break;
                    default:
                        record += line + "\n";
                        println "Rad som inte konsumerats: \t" + line;
                }
            }
            list.add(record);
            return list.collect { it ->
                prefixes.join("\n") + "\n ${it.replaceAll("nullns", "ns")}"
            };


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
        def cli = new CliBuilder(usage: 'showdate.groovy -[chflms] [SparqlEndpoint] [FileStore] [elasticEndpoint]')
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
        def settings = [index: false, fileStore: '', clearIndex: false, sparqlEndpoint: '', elasticEndpoint: '']
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
            settings.elasticEndpoint = extraArguments[2]
        }

        return settings
    }
    String initData = """{
    "mappings": {
        "dataQuality": {
            "properties": {
                "qualityViolations.label": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                 "qualityViolations.severity": {
                    "type": "integer"
                }

            }
        },
        "bibliometrician": {
            "properties": {
                "publicationStatus": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "outputCode": {
                    "type": "string",
                    "index": "not_analyzed"
                }
            }
        }
    }
}"""
}