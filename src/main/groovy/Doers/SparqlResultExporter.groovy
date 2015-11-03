package Doers

import Clients.SMTP
import org.apache.http.HttpEntity
import org.apache.http.HttpResponse
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.ContentType
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager
import org.apache.http.message.BasicNameValuePair
import org.apache.http.util.EntityUtils
import groovy.util.logging.Slf4j

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/**
 * Ported from java and mildly groovyfied
 * Executes a Sparql Query and puts the resutls to disk.
 * If everything goes well, the user recieves two emails. One when the execution starts and one when it finishes.
 *
 * **/
@Slf4j
public class SparqlResultExporter {

    def config = new ConfigSlurper().parse(SparqlResultExporter.classLoader.getResource("config.groovy"))

    def nowString = { return (new Date()).format("yyyy_MM_dd_HH_mm_ss", TimeZone.getTimeZone('UTC')) }
    def localDir = {
        return (config?.ftp?.storageDir != null && new File(config.ftp.storageDir as String).exists()) ?
                config.ftp.storageDir
                : System.getProperty("java.io.tmpdir")
    }

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
        resourceDir = config.ftp.resourceDir
        storageDir = config.ftp.storageDir
        ftpRoot = config.ftp.ftpRoot
        sparqlEndpointURL = config.ftp.sparqlEndpoint
    }


    public Map startQueryAndDownload(String query, String format, String emailAddress, boolean zipIt = true) {

        //Send notification that the file is on its way.
       // SMTP.simpleMail(emailAddress, "din fil skickas snart", "Din fil är på väg i väldig fart", config.smtp.host as String, config.smtp.port as String)
        try{
        def prepData = prepareQueryExecution(sparqlEndpointURL, query, format, emailAddress, zipIt)
        Thread thread = Thread.start {
            try {
                byte[] content = null;
                prepData.fileStatus.write("RUN: ${nowString()} \n")
                PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
                connectionManager.defaultMaxPerRoute = 10;

                content = makeRequest(sparqlEndpointURL, connectionManager, content, prepData.queryString, prepData.format, maxRows, prepData.fileStatus)
                if (zipIt) {
                    saveZipFile(content, prepData.queryString, prepData.fileResults)
                    log.info "Zipped:" + prepData.fileResults.absolutePath
                } else {
                    prepData.fileResults.bytes = content;
                    log.info "Saved:" + prepData.fileResults.absolutePath
                }
                prepData.fileStatus.write("DONE: ${nowString()} \n")
                SMTP.simpleMail(emailAddress, "Din fil är färdig", "Din fil är färdig för nedladdning ${config.ftp.ftpRoot + prepData.dirName + "/" + prepData.fileResults.name}", config.smtp.host as String, config.smtp.port as String)
            } catch (all) {
                // TODO Auto-generated catch block
                prepData.fileStatus.write(all.message)
                log.error(all.message + all.stackTrace)
                prepData.fileStatus.write("FAILED: ${nowString()}")
                SMTP.simpleMail(emailAddress, "Din fil kunde inte skapas", "Vi misslyckades med att skapa din fil.\n Felmeddelande:\n${all.message}Sökfråga:\n${prepData.dirName}", config.smtp.host as String, config.smtp.port as String)
            }
        }
        sleep(3000)
        if(thread.isAlive()){
            log.info "thread is alive. Sending email."
            SMTP.simpleMail(emailAddress, "din fil skickas snart", "Din fil är på väg i väldig fart", config.smtp.host as String, config.smtp.port as String)
        }
            return [success:true,errorMessage: null]
        }
        catch(all){
            return [success:false,errorMessage:all.message ]
        }



    }

    public Map prepareQueryExecution(String sparqlEndpointURL, String query, String format, String emailAddress, boolean zipIt) {
        String dirName = "resultSet_" + nowString()
        String queryLimited = query + limitClause
        log.info "query: ${queryLimited} \n format: ${format}"
        String filePath = localDir() + dirName + pathSeparator

        File dir = new File(localDir() + dirName)
        dir.mkdir()

        def fileExtension = zipIt ? ".zip" : determineFileExtension(format)
        File fileResults = new File(filePath + dirName + fileExtension)
        fileResults.write ""

        File fileStatus = new File(filePath + "status.txt")
        log.info(fileResults.absolutePath)
        fileStatus.write("START: ${nowString()} \n format: ${format}\n")

        return [url: sparqlEndpointURL, queryString: queryLimited, format: format, fileResults: fileResults, fileStatus: fileStatus, emailAddress: emailAddress, zipIt: zipIt, dirName: dirName]
    }

    /**
     * Maps a mime type to a file extension Defaults to ".txt"
     * @param format mime type
     * @return String containing file extension and leading dot (.)
     */
    static String determineFileExtension(String format) {
        //TODO: Replace with map
        switch (format) {
            case "text/html":
                return ".html"
                break;
            case "application/vnd.ms-excel":
                return ".xls"
                break;
            case "application/sparql-results+xml":
                return ".xml"
                break;
            case "application/sparql-results+json":
                return ".json"
                break;
            case "application/javascript":
                return ".js"
                break;
            case "text/turtle":
                return ".ttl"
                break;
            case "application/rdf+xml":
                return ".rdf"
                break;
            case 'text/plain':
                return ".txt"
                break;
            case 'text/csv':
                return ".csv"
                break;
            case 'text/tab-separated-values':
                return ".tsv"
                break;
            default:
                return ".data"

        }
    }

    public
    static byte[] makeRequest(String url, PoolingHttpClientConnectionManager connectionManager, byte[] content, String queryString, String format, int maxRows, File fileStatus) {
        fileStatus.write("PING!")
        HttpPost postRequest = new HttpPost(url);
        postRequest.entity = new UrlEncodedFormEntity([
                new BasicNameValuePair("query", queryString),
                new BasicNameValuePair("format", format),
                new BasicNameValuePair("maxrows", maxRows.toString())])

        def httpClient = new HttpClientBuilder().setConnectionManager(connectionManager).build()

        HttpResponse response = httpClient.execute(postRequest);
        HttpEntity entity = response.entity;
        if (entity != null && ContentType.get(entity) != null) {
            content = EntityUtils.toByteArray(entity);
        }
        if (response.statusLine.statusCode != 200) {
            fileStatus.write(new String(content) + "\n")
            throw new Exception("Fel i anropet till Sparql-endpointen")
        } else {
            fileStatus.write("${new Date().format('yyyy-MM-dd HH:mm:ss')}: Query execution successful. Starting saving the file\n")
        }
        return content
    }

    static void saveZipFile(byte[] content, String query, File file) throws IOException {
        log.info "Create result zip file"
        def bytesFile = createResultFile(content, query);
        log.info "Created"

        file.withOutputStream { fos ->
            fos.write(bytesFile);
        }
        log.info "Saved:" + file.absolutePath
    }


    public static createResultFile(def content, String query) {

        def byteArrayOutputStream = new ByteArrayOutputStream();
        ZipOutputStream gZipOutputStream;
        try {
            gZipOutputStream = new ZipOutputStream(byteArrayOutputStream)
            gZipOutputStream.method = ZipOutputStream.DEFLATED;

            //Query File
            gZipOutputStream.putNextEntry(new ZipEntry("query.sparql"))
            gZipOutputStream.write(query.bytes);
            gZipOutputStream.closeEntry();

            // Entry for Data file
            gZipOutputStream.putNextEntry(new ZipEntry("query_result.data"))
            log.info "start write to gZipOutputStream"
            gZipOutputStream.write(content as byte[])
            gZipOutputStream.closeEntry();
            log.info "gZipOutputStream closeEntry"
            log.info "string buffer created"
        }
        catch (all) {
            log.error("", all)
            throw all
        }
        finally {
            gZipOutputStream.close();
        }
        log.info "createResultFile returning"
        return byteArrayOutputStream.toByteArray()
    }
}

