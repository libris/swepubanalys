import org.junit.After
import org.junit.Before
import org.junit.Test
import wslite.json.JSONObject
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-10-23.
 */
class SMTP {

    @Before
    public void setUp() throws Exception {
        printf "Set Up"
    }
    @After
    public void tearDown() throws Exception{
        printf "Tear Down"
    }

    @Test
    public void sendMail(){
        URL url = SMTP.getClassLoader().getResource("config.groovy");
        def config = new ConfigSlurper().parse(SparqlResultExporter.getClassLoader().getResource("config.groovy"))

        def message = "hejjom svejjom"
        def subject = "groovy sent this"
        def toAddress = "theodor.tolstoy@kb.se" //; separerar flera adresser
        def fromAddress = config.smtp.from
        def host = config.smtp.host
        def port = config.smtp.port

        Clients.SMTP.simpleMail(fromAddress,toAddress, subject, message, host, port)
    }


}
