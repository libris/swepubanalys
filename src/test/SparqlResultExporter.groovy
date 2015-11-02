import groovy.util.logging.Slf4j
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager
import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * Created by Theodor on 2015-10-29.
 */
@Slf4j
class SparqlResultExporter {
    String query = """PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#> SELECT DISTINCT ?_label ?Class ?_severity ?_comment WHERE { ?Class rdfs:comment ?_comment . ?Class rdfs:label ?_label . ?Class swpa_m:severity ?_severity . }"""
    String format = "text/csv"
   def config = new ConfigSlurper().parse(SparqlResultExporter.getClassLoader().getResource("config.groovy"))



    @Before
    public void setUp() throws Exception {
        println "Set Up"
    }

    @After
    public void tearDown() throws Exception {
        println "Tear Down"
    }

    @Test
    public void exportAll() {
       def sre = new Doers.SparqlResultExporter()
        def result = sre.startQueryAndDownload(query,format,"theodor.tolstoy@kb.se",true)
        assert resut.endsWith(".zip")
    }


        @Test
    public void exportPartsZip() {
        URL url = SparqlResultExporter.getClassLoader().getResource("config.groovy");
        def config = new ConfigSlurper().parse(url)
       String sparqlEndpointURL = config.ftp.sparqlEndpoint



        def ftpClient = new Doers.SparqlResultExporter();
        def result = ftpClient.prepareQueryExecution(sparqlEndpointURL,query,format, "resultset_" + ftpClient.nowString(), "theodor.tolstoy@kb.se", true);
        assert result instanceof Map


        byte[] content = null;
        PoolingHttpClientConnectionManager connman = new PoolingHttpClientConnectionManager();
        content = Doers.SparqlResultExporter.makeRequest(sparqlEndpointURL, connman,content,query,format,200,result.fileStatus);
        assert content instanceof byte[]
        assert result.fileStatus.text.contains("Query execution successful")
        def length = result.fileZip.length()
        Doers.SparqlResultExporter.saveZipFile(content, query,result.fileZip)

        assert length < result.fileZip.length()

    }
    @Test
    public void exportPartsTSV() {
        //URL url = SparqlResultExporter.getClassLoader().getResource("config.groovy");
        //def config = new ConfigSlurper().parse(SparqlResultExporter.getClassLoader().getResource("config.groovy"))
        String sparqlEndpointURL = config.ftp.sparqlEndpoint

        def ftpClient = new Doers.SparqlResultExporter();
        def result = ftpClient.prepareQueryExecution(sparqlEndpointURL,query,"text/tab-separated-values", "theodor.tolstoy@kb.se", false);
        assert result instanceof Map
        assert result.fileResults.name.endsWith(".tsv")
        log.info(result.fileResults.absolutePath)

        byte[] content = null;
        PoolingHttpClientConnectionManager connman = new PoolingHttpClientConnectionManager();
        content = Doers.SparqlResultExporter.makeRequest(sparqlEndpointURL, connman,content,result.queryString,result.format,200,result.fileStatus);
        assert content instanceof byte[]
        assert result.fileStatus.text.contains("Query execution successful")
        result.fileResults.bytes = content
        def length = result.fileResults.length()
        assert length > 0
        result.fileResults.eachLine {it->assert it.contains('\t')}

    }
}
