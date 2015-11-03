package Clients

import groovy.util.logging.Slf4j

import javax.mail.*
import javax.mail.internet.*

/**
 * Sends emails over SMTP
 */
@Slf4j
public class SMTP {


    public static void simpleMail(String to, String subject, String body, String host, String port) {
        try {
            //TODO: configurable email address.
            def from = "theodor.tolstoy@kb.se"
            Properties props = System.getProperties();
            props["mail.smtp.host"] = host;
            props["mail.smtp.port"] = port;
            props["mail.smtp.connectiontimeout"] = 1000
            Session session = Session.getDefaultInstance(props, null);
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            InternetAddress toAddress = new InternetAddress(to);
            message.addRecipient(Message.RecipientType.TO, toAddress);
            message.setSubject(subject);
            message.setText(body);
            Transport transport = session.getTransport("smtp");
            transport.connect(host, port.toInteger(), "", "");
            transport.sendMessage(message, message.getAllRecipients());
            transport.close();
        }
        catch (all) {
            // silent exception handling since we do not want to interrupt the process calling this method
            log.error("Error when sending mail", all)
        }
    }
}

