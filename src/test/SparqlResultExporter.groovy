import org.apache.http.impl.conn.PoolingHttpClientConnectionManager
import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * Created by Theodor on 2015-10-29.
 */
class SparqlResultExporter {
    @Before
    public void setUp() throws Exception {
        println "Set Up"
    }

    @After
    public void tearDown() throws Exception {
        println "Tear Down"
    }

    @Test
    public void export() {
        URL url = SparqlResultExporter.getClassLoader().getResource("config.groovy");
        def config = new ConfigSlurper().parse(url)
       String sparqlEndpointURL = config.ftp.sparqlEndpoint


        String query = """PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>

SELECT DISTINCT
?_label
?Class
?_severity
?_comment
WHERE
{
?Class rdfs:comment ?_comment .
?Class rdfs:label ?_label .
?Class swpa_m:severity ?_severity .
}"""
        String format = "text/csv"
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
}
