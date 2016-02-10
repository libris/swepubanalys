import Traits.ConfigConsumable
import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * Created by Theodor on 2015-10-23.
 */
class SMTP implements ConfigConsumable  {

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
        String message = "hejjom svejjom"
        String subject = "groovy sent this"
        String toAddress = "theodor.tolstoy@kb.se" //; separerar flera adresser
        String fromAddress = currentConfig().smtp.from
        String host = currentConfig().smtp.host
        String port = currentConfig().smtp.port

        Clients.SMTP.simpleMail(fromAddress,toAddress, subject, message, host, port)
    }


}
