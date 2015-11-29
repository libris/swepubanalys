@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
import groovy.json.JsonBuilder

import static groovyx.gpars.GParsPool.withPool

//Load helper methods from external file
def script = new GroovyScriptEngine('.').with {
    loadScriptByName('IndexingTools.groovy')
}
this.metaClass.mixin script

//Load settings
def settings = getCLISettings(args)

//Load files
Map context = new File("contextQuality.jsonld").withInputStream JsonUtils.&fromInputStream
assert context

def qualitySparql = new File("sparqls/dataQualityViolations.sparql").text
assert qualitySparql

def bibliometricianSparql = new File("sparqls/query.rq").text
assert bibliometricianSparql


println "Grab and Init done. Starting..."
println "Settings: ${settings}"

//Load dataqualityViolations
Map qualityViolations = getDataQualityViolations(settings.sparqlEndpoint)
assert qualityViolations.any { it }

//Load organisations
def orgs = allOrgs(settings.sparqlEndpoint)
assert orgs.any { it }
println orgs


println "Grab and Init done. Starting..."


long startTick = System.nanoTime();

withPool(10) {
    orgs.eachParallel { orgCode ->
        def batchName = "quality_${orgCode}";
        println orgCode + "\t start"

        try {
            def severityByViolationName = { String violationName -> [label: violationName, severity: qualityViolations.values.find { tit -> tit.name == violationName }?.severity ?: 0] }
            def compactos = splitTurtles(getTurtle(qualitySparql, settings.sparqlEndpoint, orgCode)).collect { turtle -> compact(expand(turtle, orgCode), context, orgCode) }
            def d = compactos.collect { compacto ->
                return compacto != null ? compacto."@graph".find { rec -> rec."@type" == "Record" || rec."@type" == "http://swepub.kb.se/mods/data#Record"} : null
            }
            def e = d.collect { record ->
                if (record?.hasMods?.qualityName != null) {
                    def newStuff = (record.hasMods.qualityName instanceof String) ?
                            [severityByViolationName(record.hasMods.qualityName as String)]
                            : record.hasMods.qualityName.collect { qualityName -> severityByViolationName(qualityName) }
                    record['qualityViolations'] = newStuff;
                }
                return record
            }
            handleJsons(e, batchName, "swepub", "dataQuality", settings)

        } catch (All) {
            println "fel"
            println All.message
            println All.stackTrace
        }
        try {
            batchName = "bibliometrician_${orgCode}";
            errorfile = new File("${settings.fileStore}/error_${batchName}.json");
            def turtles = splitTurtles(getTurtle(bibliometricianSparql, settings.sparqlEndpoint, orgCode)).findAll {
                it
            }
            def compactos = turtles.findAll {
                it != null
            }.collect { turtle -> compact(expand(turtle, orgCode), context, orgCode) }
            def d = compactos.findAll { it != null }.collect { compacto ->
                if (compacto != null) {
                    result = compacto."@graph".find { rec -> rec."@type" == "Record" || rec."@type" == "http://swepub.kb.se/mods/data#Record" }
                    if (result)
                        return result
                    else errorfile.append(new JsonBuilder(compacto).toPrettyString() + ",")
                }

            }
            handleJsons(d, batchName, "swepub", "bibliometrician", settings)
            //println "${orgCode} \t färdig \t ${Math.round(((System.nanoTime() - startLoop) / 1000000))} \t"
            println "${orgCode} \t Turtles: ${turtles.count { t -> t }} Compactos: ${compactos.count { c -> c }} Jsons: ${d.count { j -> j }} \t"

        } catch (All) {
            println "fel"
            println All.message
            println All.stackTrace
        }

    }
}

private void handleJsons(List<Object> e, batchName, indexName, typeName, settings) {
    if (settings.index) {
        sendToElastic(e, indexName, typeName, settings.elasticEndpoint)
    } else {
        createElasticExport("${settings.fileStore}/${batchName}.json", e, indexName, typeName)
    }
}

println "Klart!  ${Math.round(((System.nanoTime() - startTick) / 1000000))} \t "