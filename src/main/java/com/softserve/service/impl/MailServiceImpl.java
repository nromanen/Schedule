package com.softserve.service.impl;

import com.softserve.entity.TemporarySchedule;
import com.softserve.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.util.Locale;


@Service
@PropertySource("classpath:mail.properties")
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final Environment environment;
    private final SpringTemplateEngine springTemplateEngine;
    @Value("${spring.mail.username}")
    private String username;


    @Autowired
    public MailServiceImpl(JavaMailSender mailSender, Environment environment, SpringTemplateEngine springTemplateEngine) {
        this.mailSender = mailSender;
        this.environment = environment;
        this.springTemplateEngine = springTemplateEngine;
    }

    /**
     * Method for sending message from server to user
     * @param emailTo to whom the message will be sent
     * @param subject the subject of the message
     * @param message message from the letter
     */
    @Async
    public void send(String emailTo, String subject, String message) {
        log.info("Enter into send method with emailTo {}, subject {}", emailTo, subject);
        String credentialsUsername = environment.getProperty(username);
        if (credentialsUsername == null) {
            credentialsUsername = System.getenv("HEROKU_MAIL_USERNAME");
        }

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(credentialsUsername);
        mailMessage.setTo(emailTo);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }

    @Override
    public void send(String filename, String receiver, String subject, String message, ByteArrayOutputStream bos) throws MessagingException {
        log.info("Enter into send method with emailTo - {}, subject - {}", receiver, subject);
        String credentialsUsername = environment.getProperty(username);
        if (credentialsUsername == null) {
            credentialsUsername = System.getenv("HEROKU_MAIL_USERNAME");
        }

        final MimeMessage mimeMessage = this.mailSender.createMimeMessage();

        mimeMessage.setFrom(new InternetAddress(credentialsUsername));
        mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(receiver));

        mimeMessage.setSubject(subject);

        DataSource fds = new ByteArrayDataSource(bos.toByteArray(), "application/pdf");

        Multipart multipart = new MimeMultipart();

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText(message, "utf-8", "html");
        multipart.addBodyPart(messageBodyPart);

        MimeBodyPart fileBodyPart = new MimeBodyPart();
        fileBodyPart.setDataHandler(new DataHandler(fds));
        fileBodyPart.setFileName(filename);
        multipart.addBodyPart(fileBodyPart);

        mimeMessage.setContent(multipart);
        this.mailSender.send(mimeMessage);
    }

    @Async
    public void send(final String emailTo, final String subject, TemporarySchedule temporarySchedule, final String emailTemplate) throws MessagingException
    {

        String credentialsUsername =  username;
        if (credentialsUsername == null) {
            credentialsUsername = System.getenv("HEROKU_MAIL_USERNAME");
        }
        // Prepare the evaluation context
        final Context ctx = new Context(Locale.UK);
        ctx.setVariable("temporarySchedule", temporarySchedule);
        //ctx.setVariable("imageResourceName", imageResourceName); // so that we can reference it from HTML

        // Prepare message using a Spring helper
        final MimeMessage mimeMessage = this.mailSender.createMimeMessage();
        final MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8"); // true = multipart
        message.setSubject(subject);
        message.setFrom(credentialsUsername);
        message.setTo(emailTo);

        // Create the HTML body using Thymeleaf
        final String htmlContent = this.springTemplateEngine.process(emailTemplate, ctx);
        message.setText(htmlContent, true); // true = isHtml
        // Send mail
        this.mailSender.send(mimeMessage);
    }

}
