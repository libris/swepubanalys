package Clients
import javax.mail.*
import javax.mail.internet.*

/**
 * Created by Theodor on 2015-10-23.
 */

public class SMTP  {



/**
 * javadoc is cool.
 **/
     public static sendmail(String message ,String subject, String toAddress, String fromAddress, String host, String port){
        Properties mprops = new Properties();
        mprops.setProperty("mail.transport.protocol","smtp");
        mprops.setProperty("mail.host",host);
        mprops.setProperty("mail.smtp.port",port);

        Session lSession = Session.getDefaultInstance(mprops,null);
        MimeMessage msg = new MimeMessage(lSession);

        StringTokenizer tok = new StringTokenizer(toAddress,";");
        ArrayList emailTos = new ArrayList();
        while(tok.hasMoreElements()){
            emailTos.add(new InternetAddress(tok.nextElement().toString()));
        }
        InternetAddress[] to = new InternetAddress[emailTos.size()];
        to = (InternetAddress[]) emailTos.toArray(to);
        msg.setRecipients(MimeMessage.RecipientType.TO,to);
        msg.setFrom(new InternetAddress(fromAddress));
        msg.setSubject(subject);
        msg.setText(message)

        Transport transporter = lSession.getTransport("smtp");
        transporter.connect();
        transporter.send(msg);
    }
}