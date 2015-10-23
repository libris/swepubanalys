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
        def message = "hejjom svejjom"
        def subject = "groovy sent this"
        def toAddress = "theodor.tolstoy@kb.se" //; separerar flera adresser
        def fromAddress = "groovy@buildseerver"
        def host = "my.mail.host"
        def port = "25"

        Clients.SMTP.sendmail(message , subject, toAddress, fromAddress, host, port);
    }


}
