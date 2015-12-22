@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils
@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.utils.JsonUtils

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

/*if (settings.index) {
    println "Set to index data into ElasticSearch. Deleteing old data"
    putToElastic()
    println "Posting new initscript"

}*/

long startTick = System.nanoTime();

withPool(10) {
    orgs.eachParallel { orgCode ->
        getTurtle([
                sparqlQuery      : qualitySparql,
                elasticEndpoint:    settings.elasticEndpoint,
                sparqlEndpoint   : settings.sparqlEndpoint,
                organisationCode : orgCode,
                batchName        : "quality_${orgCode}",
                context          : context,
                graphFilter      : { m -> m.@type == "Mods" },
                elasticType       : "dataQuality",
                qualityViolations: qualityViolations,
                fileStore        : settings.fileStore,
                index            : settings.index
        ])
    }
}

withPool(10) {
    orgs.eachParallel { orgCode ->
        try {

            getTurtle([
                    sparqlQuery      : bibliometricianSparql,
                    elasticEndpoint:    settings.elasticEndpoint,
                    sparqlEndpoint   : settings.sparqlEndpoint,
                    organisationCode : orgCode,
                    batchName        : "bibliometrician_${orgCode}",
                    context          : context,
                    graphFilter      : { rec -> rec."@type" == "Record" },
                    elasticType       : "bibliometrician",
                    qualityViolations: qualityViolations,
                    fileStore        : settings.fileStore,
                    index            : settings.index
            ])

        } catch (All) {
            println "fel \n"
            println All.message + "\n"
            println All.stackTrace
        }
    }
}



println "Klart!  ${Math.round(((System.nanoTime() - startTick) / 1000000))} \t "