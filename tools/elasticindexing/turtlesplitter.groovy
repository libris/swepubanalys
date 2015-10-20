@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import static groovyx.gpars.GParsPool.withPool
import com.github.jsonldjava.utils.JsonUtils

/**
 * Script that transforms turtle formatted data into elasticsearch import files
 */


def script = new GroovyScriptEngine('.').with { //Load helper methods from other script file
    loadScriptByName('IndexingTools.groovy')
}
this.metaClass.mixin script

long startTick = System.nanoTime();
println "Starting..."

Map context = new File("context.jsonld").withInputStream JsonUtils.&fromInputStream //Load context file for compaction

withPool(8) {
    allOrgs().eachParallel { orgCode ->
        long startLoopTick = System.nanoTime();
        def batchName = "${orgCode}";

        try {
            print "\n" + batchName + "\t start"
            createElasticExport("elasticready/${batchName}.json",
                    splitTurtles(saveTurtle("query.rq", orgCode)).collect { turtle ->
                        def c = compact(expand(turtle), context);
                        return c != null ? c."@graph".find { rec -> rec."@type" == "Record" } : null;
                    });
            print "\n" + batchName + "\t finish \t "+ Math.round(((System.nanoTime() - startLoopTick) / 1000000)) +"\t"


        } catch (All) {
            println "fel"
            println All.message
            println All.stackTrace

        }
    }
}
println "Finished! " + Math.round(((System.nanoTime() - startTick) / 1000000)) + "\t"
