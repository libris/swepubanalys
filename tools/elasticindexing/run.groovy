@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
@Grab('org.codehaus.groovy.modules.http-builder:http-builder:0.6')
import com.github.jsonldjava.utils.JsonUtils
import groovy.io.FileType

import static groovyx.gpars.GParsPool.withPool

//Load helper methods from external file
def script = new GroovyScriptEngine('.').with {
    loadScriptByName('IndexingTools.groovy')

}
this.metaClass.mixin script

//Load settings
def settings = getCLISettings(args)

//Load files
def context = new File("contextQuality.jsonld").withInputStream JsonUtils.&fromInputStream
assert context

def qualitySparql = new File("sparqls/dataQualityViolations.sparql").text
assert qualitySparql
Map qualityViolations = getDataQualityViolations(settings.sparqlEndpoint)
assert qualityViolations.any { it }



def bibliometricianSparql = new File("sparqls/query.rq").text

assert bibliometricianSparql


println "Grab and Init done. Starting..."
println "Settings: ${settings}"

//Load organisations
def orgs = allOrgs(settings.sparqlEndpoint)
assert orgs.any { it }
println orgs


println "Grab and Init done. Starting..."

long startTick = System.nanoTime();

if (settings.index) {
    println "Set to index data into ElasticSearch. Deleteing old data..."
    removeFromElastic(settings.elasticEndpoint)
    println "Deleting Done. Posting new initscript:"
    println initData
    putToElastic(settings.elasticEndpoint, '', initData)
    def files = []
    def dir = new File(settings.fileStore)
    dir.eachFileRecurse(FileType.FILES) { file ->
        files << file
    }
    def lines = 0
    println "Posting new initscript"
    println "Found ${files.count { c -> c }} files to index"
    files.findAll { file -> file.getName().endsWith(".json") }.toSorted { b -> b.length() }.each { file ->
        def fileLines = file.readLines().count { line -> line }
        println "${new Date()} Skickar ${file.getName()} med ${fileLines} rader (${fileLines / 2} poster) "
        lines += fileLines
        putToElastic(settings.elasticEndpoint, '/_bulk', file.text)
    }
    println "totalt antal rader: ${lines} (${lines / 2} poster) "


} else {
    def totalResults = []
    /*withPool(8) {
        orgs.eachParallel { orgCode ->
            try {
                totalResults.add(getTurtle([
                        sparqlQuery      : qualitySparql,
                        elasticEndpoint  : settings.elasticEndpoint,
                        sparqlEndpoint   : settings.sparqlEndpoint,
                        organisationCode : orgCode,
                        batchName        : "dataQuality_${orgCode}",
                        context          : context,
                        graphFilter      : { rec -> rec."@type" == "Record" },
                        elasticType      : "dataQuality",
                        qualityViolations: qualityViolations,
                        fileStore        : settings.fileStore,
                        index            : settings.index
                ]))


            } catch (All) {
                println "fel \n"
                println All.message + "\n"
                println All.stackTrace
            }
        }
    }*/
    withPool(8) {
        orgs.eachParallel { orgCode ->
            try {
                totalResults.add(getTurtle([
                        sparqlQuery      : bibliometricianSparql,
                        elasticEndpoint  : settings.elasticEndpoint,
                        sparqlEndpoint   : settings.sparqlEndpoint,
                        organisationCode : orgCode,
                        batchName        : "bibliometrician_${orgCode}",
                        context          : context,
                        graphFilter      : { rec -> rec."@type" == "Record" },
                        elasticType      : "bibliometrician",
                        qualityViolations: qualityViolations,
                        fileStore        : settings.fileStore,
                        index            : settings.index
                ]))


            } catch (All) {
                println "fel \n"
                println All.message + "\n"
                println All.stackTrace
            }
        }
    }
}



println "Klart!  ${Math.round(((System.nanoTime() - startTick) / 1000000))} \t "