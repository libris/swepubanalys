package Clients

import org.apache.http.HttpEntity
import org.apache.http.HttpResponse
import org.apache.http.client.HttpClient
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.ContentType
import org.apache.http.impl.client.HttpClients
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager
import org.apache.http.util.EntityUtils

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import groovy.util.logging.Slf4j

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

@Slf4j
public class FTP {

    def nowString = { return (new Date()).format("yyyy_MM_dd_HH_mm_ss", TimeZone.getTimeZone('UTC')) }

    private static final long SERIALVERSIONUID = 1L;
    static int MAX_ROWS = 2000000;
    String mResourceDir;
    String mStorageDir;
    String mFtpRoot;
    String mSparqlEndpointURL;

    static String pathSeparator;
    static String LIMIT_CLAUSE = "\nLIMIT 2000000";


    static String mods_data_ns = "http://swepub.kb.se/mods/data#";

    String prefix = "PREFIX swpa_d: <http://swepub.kb.se/SwePubAnalysis/data#>\n" +
            "PREFIX swpa_m: <http://swepub.kb.se/SwePubAnalysis/model#>\n" +
            "PREFIX mods_d: <http://swepub.kb.se/mods/data#>\n";

    public FTP() {
        println "init"
        URL url = Elasticsearch.getClassLoader().getResource("config.groovy");
        def config = new ConfigSlurper().parse(url)
        mResourceDir = config.ftp.resourceDir
        mStorageDir = config.ftp.storagetDir
        mFtpRoot = config.ftp.ftpRoot
        mSparqlEndpointURL = config.ftp.sparql_endpoint
        pathSeparator = System.getProperty("file.separator")
        println "init done"
    }


    public String startQueryAndDownload(String query, String format) {

        String queryLimited = query + LIMIT_CLAUSE

        log.info "query: ${queryLimited}"
        log.info "format: ${format}"


        String dirName = "resultset_" + nowString
        File dir = new File(mStorageDir + dirName)
        dir.mkdir()
        String filePath = mStorageDir + dirName + pathSeparator + dirName + ".zip";
        File file = new File(filePath);

        // Create status file
        File fileStatus = new File(mStorageDir + dirName + pathSeparator + "status.txt");
        fileStatus.write("START: ${nowString} \n format: ${format}\n")

        // Make the query
        new QueryExecuter(mSparqlEndpointURL, queryLimited, format, file, fileStatus);

        return dirName;
    }

    void saveZipFile(byte[] content, String query, File file) throws IOException {
        log.info "Create result zip file"

        byte[] bytesfile;
        bytesfile = Utils.createResultFile(content, ",", query);

        log.info "Created"
        // Save the file locally on the server first !!!
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(bytesfile);
        fos.close();
        log.info "Saved:" + file.getAbsolutePath()

        //fos = null;
    }


    static public String readFile(File file) {

        // Load from file

        long fileSize = file.length();
        byte[] bytes = new byte[(int) fileSize];
        FileInputStream fis;
        String content;
        try {
            fis = new FileInputStream(file);
            fis.read(bytes);
            content = new String(bytes, "UTF-8");
            fis.close();
        } catch (Exception e) {
            log.error "", e;
            content = null;
        }
        return content;
    }

    public static byte[] createResultFile(byte[] content, String separator, String query){

        log.info "createResultFile:" + content.length + " bytes"

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ZipOutputStream gzipout;
        try {
            gzipout = new ZipOutputStream(bos);
            gzipout.setMethod(ZipOutputStream.DEFLATED);

            // Entry for Query file
            ZipEntry entry = new ZipEntry("query.sparql");
            gzipout.putNextEntry(entry);
            gzipout.write(query.getBytes());
            gzipout.closeEntry();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return e.getMessage().getBytes();
        }


        try{
            // Entry for csv file
            ZipEntry entry = new ZipEntry("query_result.data");
            gzipout.putNextEntry(entry);
            log.info "start write to gzipout"
            gzipout.write(content);
            gzipout.closeEntry();
            log.info "gzipout closeEntry"

            log.info "string buffer created"
        }
        catch(Exception e)
        {
            log.error("", e)
            return e.getMessage().getBytes();
        }

        try {
            gzipout.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        log.info "createResultFile returning"
        return bos.toByteArray();
    }


    @Slf4j
    private class QueryExecuter implements Runnable {
        Thread myThread;
        String mQueryString;
        String mFormat;
        String mStrURL;
        File mFileZip;
        File mFileStatus;

        private final Lock lock;

        QueryExecuter(String url, String query, String format, File file, String fileStatus) {

            mStrURL = url;
            mQueryString = query;
            mFormat = format;
            mFileZip = file;
            mFileStatus = fileStatus;

            lock = new ReentrantLock();

            myThread = new Thread(this);

            //loggerThread.info("start thread");
            //http://stackoverflow.com/questions/1342430/groovy-way-to-log-process-output

            myThread.start();
        }

        @Override
        public void run() {

            // Do stuff
            //loggerThread.info("Exceute query: ");
            //loggerThread.info(mQueryString);

            byte[] content = null;

            PoolingHttpClientConnectionManager connman = new PoolingHttpClientConnectionManager();
            connman.setDefaultMaxPerRoute(10);

            try {
                HttpPost postRequest = new HttpPost(mStrURL);

                def nameValuePairs = [];
                nameValuePairs.add(["query", mQueryString])
                nameValuePairs.add(["format", mFormat])
                nameValuePairs.add(["maxrows", new Integer(MAX_ROWS).toString()])
                postRequest.setEntity(new UrlEncodedFormEntity(nameValuePairs))

                HttpClient httpClient = HttpClients.custom(conman).build()

                HttpResponse response = httpClient.execute(postRequest);

                int status = response.getStatusLine().getStatusCode();

                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    ContentType contentType = ContentType.get(entity);
                    if (contentType != null) {
                        //String mimeType = contentType.getMimeType();

                        content = EntityUtils.toByteArray(entity);
                    }
                }

                // Error returned from endpoint
                if (status != 200) {
                    mFileStatus.write(new String(content) + "\n")
                } else {
                    mFileStatus.write("${nowString}: Query execution successful. Starting saving the file\n");
                }

            } catch (Exception e1) {
                // TODO Auto-generated catch block
                mFileStatus.write(e1.getCause().getMessage() + "\n")
                mFileStatus.write(e1.getStackTrace().toString() + "\n")
                mFileStatus.write("FAILED: ${nowString} \n")
            }

            try {
                saveZipFile(content, mQueryString, mFileZip);
                mFileStatus.write("DONE: ${nowString} \n")
            } catch (IOException e) {
                // TODO Auto-generated catch block
                mFileStatus.write(e.getCause().getMessage() + "\n")
                mFileStatus.write(e.getStackTrace().toString() + "\n")
                mFileStatus.write("FAILED: ${nowString} \n")
            }
        }
    }

}

