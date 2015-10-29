package Doers

import org.apache.http.HttpEntity
import org.apache.http.HttpResponse
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.ContentType
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager
import org.apache.http.message.BasicNameValuePair
import org.apache.http.util.EntityUtils

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import groovy.util.logging.Slf4j

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/**
 * Ported from java and mildly groovyfied
 *
 * **/
@Slf4j
public class SparqlResultExporter {

    def nowString = { return (new Date()).format("yyyy_MM_dd_HH_mm_ss", TimeZone.getTimeZone('UTC')) }
    def tmpDir = { return System.getProperty("java.io.tmpdir") }

    int maxRows = 2000000
    String resourceDir
    String storageDir
    String ftpRoot
    String sparqlEndpointURL
    String pathSeparator = System.getProperty("file.separator")
    String limitClause = "\nLIMIT 2000000";

    String prefix = "PREFIX swpa_d: <http://swepub.kb.se/SwePubAnalysis/data#>\n" +
            "PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>\n" +
            "PREFIX mods_d: <http://swepub.kb.se/mods/data#>\n";


    public SparqlResultExporter() {
        println "init"
        URL url = SparqlResultExporter.classLoader.getResource("config.groovy");
        def config = new ConfigSlurper().parse(url)
        resourceDir = config.ftp.resourceDir
        storageDir = config.ftp.storageDir
        ftpRoot = config.ftp.ftpRoot
        sparqlEndpointURL = config.ftp.sparqlEndpoint

        println "init done"
    }


    public String startQueryAndDownload(String query, String format, String emailAddress, boolean zipIt) {
        String dirName = "resultset_" + nowString()
        def prepData = prepareQueryExecution(sparqlEndpointURL, query, format, dirName, emailAddress, zipIt)
        new QueryExecuter(prepData)
        return dirName;
    }

    public Map prepareQueryExecution(String sparqlEndpointURL, String query, String format, String dirName, String emailAddress, boolean zipIt) {
        String queryLimited = query + limitClause
        log.info "query: ${queryLimited} \n format: ${format}"
        String filePath = tmpDir() + dirName + pathSeparator

        File dir = new File(tmpDir() + dirName)
        dir.mkdir()

        File file = new File(filePath + dirName + ".zip")
        file.write ""

        File fileStatus = new File(filePath + "status.txt")
        fileStatus.write("START: ${nowString()} \n format: ${format}\n")

        return [url: sparqlEndpointURL, queryString: queryLimited, format: format, fileZip: file, fileStatus: fileStatus, emailAddress: emailAddress, zipIt: zipIt]
    }


    static void saveZipFile(byte[] content, String query, File file) throws IOException {
        log.info "Create result zip file"
        def bytesFile = createResultFile(content, ",", query);
        log.info "Created"
        // Save the file locally on the server first !!!
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(bytesFile);
        fos.close();
        log.info "Saved:" + file.absolutePath
    }
    public static byte[] makeRequest(String url,PoolingHttpClientConnectionManager connman, byte[] content, String queryString, String format, int maxRows, File fileStatus) {
        HttpPost postRequest = new HttpPost(url);
        postRequest.entity = new UrlEncodedFormEntity([
                new BasicNameValuePair("query", queryString),
                new BasicNameValuePair("format", format),
                new BasicNameValuePair("maxrows", maxRows.toString())])

        def httpClient = new HttpClientBuilder().setConnectionManager(connman).build()

        HttpResponse response = httpClient.execute(postRequest);

        int status = response.statusLine.statusCode

        HttpEntity entity = response.entity;
        if (entity != null) {
            ContentType contentType = ContentType.get(entity);
            if (contentType != null) {
                content = EntityUtils.toByteArray(entity);
            }
        }
        // Error     returned from endpoint
        if (status != 200) {
            fileStatus.write(new String(content) + "\n")
        } else {
            fileStatus.write("${new Date().toGMTString()}: Query execution successful. Starting saving the file\n");
        }
        content
    }

    public static createResultFile(def content, String separator, String query) {

        def byteArrayOutputStream = new ByteArrayOutputStream();
        ZipOutputStream gZipOutputStream;
        try {
            gZipOutputStream = new ZipOutputStream(byteArrayOutputStream);
            gZipOutputStream.method = ZipOutputStream.DEFLATED;

            // Entry for Query file
            ZipEntry entry = new ZipEntry("query.sparql");
            gZipOutputStream.putNextEntry(entry);
            gZipOutputStream.write(query.bytes);
            gZipOutputStream.closeEntry();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return e.message.bytes;
        }

        try {
            // Entry for csv file
            ZipEntry entry = new ZipEntry("query_result.data");
            gZipOutputStream.putNextEntry(entry);
            log.info "start write to gZipOutputStream"
            gZipOutputStream.write(content as byte[]);
            gZipOutputStream.closeEntry();
            log.info "gZipOutputStream closeEntry"
            log.info "string buffer created"
        }
        catch (Exception e) {
            log.error("", e)
            return e.message.bytes;
        }

        try {
            gZipOutputStream.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        log.info "createResultFile returning"
        return byteArrayOutputStream.toByteArray();
    }


    @Slf4j
    public class QueryExecuter implements Runnable {
        Thread thread = new Thread(this)
        String queryString
        String format
        String url
        File fileZip
        File fileStatus
        boolean zipIt
        String emailAddress
        final Lock lock = new ReentrantLock()

        @Override
        public void run() {
            byte[] content = null;

            PoolingHttpClientConnectionManager connman = new PoolingHttpClientConnectionManager();
            connman.defaultMaxPerRoute = 10;

            try {
                content = makeRequest(sparqlEndpointURL,connman,content, queryString, format, maxRows,fileStatus)

            } catch (Exception e1) {
                // TODO Auto-generated catch block
                fileStatus.write(e1.cause.message + "\n")
                fileStatus.write(e1.stackTrace.toString() + "\n")
                fileStatus.write("FAILED: ${nowString()} \n")
            }

            try {
                saveZipFile(content, queryString, fileZip);
                fileStatus.write("DONE: ${nowString()} \n")
            } catch (IOException e) {
                // TODO Auto-generated catch block
                fileStatus.write(e.cause.message + "\n")
                fileStatus.write(e.stackTrace.toString() + "\n")
                fileStatus.write($/FAILED: ${nowString()} \n/$)
            }
        }

    }

}

