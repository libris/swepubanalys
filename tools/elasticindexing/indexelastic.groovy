@Grab('com.github.jsonld-java:jsonld-java:0.7.0')
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import com.github.jsonldjava.core.JsonLdOptions
import com.github.jsonldjava.core.JsonLdProcessor
import com.github.jsonldjava.utils.JsonUtils
import wslite.rest.ContentType
import wslite.rest.RESTClient
import wslite.rest.ContentType
import wslite.rest.RESTClient
import groovy.json.*
import groovy.io.FileType

println "grabbed. Starting"


def dirName = "elasticready";
long start = System.nanoTime();
new File(dirName).eachFile() { file->
   try {
        long startloop = System.nanoTime();

       print "\n"+file.getName() + "\t"
        //def fileName = "elasticready/export_${orgCode}_${year}.jsonld"
        putToElastic(dirName+ "/" +file.getName(), "http://localhost:9200/swepub/_bulk")//"http://10.50.16.150:9200/swepub/_bulk"

        long putToElastictick = System.nanoTime();


        print Math.round(((putToElastictick - startloop) / 1000000))+"\t"


   } catch (All) {
        println "fel!"
        println All.message
    }
}

long end = System.nanoTime();

println "Klart på " + ((end - start) / 1000000) + " millisekunder"



public void putToElastic(def fileName, def elasticPath){
    RESTClient client = new RESTClient(elasticPath)
    def response = client.put(
            path: '/',
            accept: ContentType.TEXT,

    ){text new File(fileName).text}
    print response.statusMessage +"\t"
    //assert 200 == response.statusCode
}

