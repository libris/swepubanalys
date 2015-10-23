package Clients

import javax.mail.*
import javax.mail.internet.*

/**
 * Created by Theodor on 2015-10-23.
 */

public class SMTP {


    public static void simpleMail(String to, String subject, String body, String host, String port) throws Exception {

        def from = "theodor.tolstoy@kb.se"
        Properties props = System.getProperties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", "25");

        Session session = Session.getDefaultInstance(props, null);
        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(from));

        InternetAddress toAddress = new InternetAddress(to);

        message.addRecipient(Message.RecipientType.TO, toAddress);

        message.setSubject(subject);
        message.setText(body);

        Transport transport = session.getTransport("smtp");

        transport.connect(host,25,"","");

        transport.sendMessage(message, message.getAllRecipients());
        transport.close();
    }
}
