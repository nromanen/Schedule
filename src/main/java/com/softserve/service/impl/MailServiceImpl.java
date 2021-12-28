package com.softserve.service.impl;

import com.softserve.dto.EmailMessageDTO;
import com.softserve.entity.TemporarySchedule;
import com.softserve.exception.MessageNotSendException;
import com.softserve.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.annotation.PostConstruct;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@PropertySource("classpath:mail.properties")
@Slf4j
public class MailServiceImpl implements MailService {
    @Value("${spring.mail.username}")
    private String username;

    private final JavaMailSender mailSender;

    private final SpringTemplateEngine springTemplateEngine;

    private String credentialsUsername;

    @Autowired
    public MailServiceImpl(JavaMailSender mailSender,
                           SpringTemplateEngine springTemplateEngine) {
        this.mailSender = mailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    @PostConstruct
    private void postConstruct() {
        credentialsUsername = username;
        if (credentialsUsername == null) {
            credentialsUsername = System.getenv("HEROKU_MAIL_USERNAME");
        }
    }

    /**
     * Method for sending message from server to user
     * @param emailTo to whom the message will be sent
     * @param subject the subject of the message
     * @param message message from the letter
     */
    @Async
    @Override
    public void send(String emailTo, String subject, String message) {
        log.info("Enter into send method with emailTo {}, subject {}", emailTo, subject);

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(credentialsUsername);
        mailMessage.setTo(emailTo);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }

    /**
     * Method for sending message from user to different emails
     * @param sender from whom the message will be sent
     * @param emailMessageDTO message that will be sent
     */
    @Override
    public void send(String sender, EmailMessageDTO emailMessageDTO) throws IOException {
        log.info("Enter into send method with sender - {}, emailMessageDTO - {}", sender, emailMessageDTO);
        try {
            MimeMessage message = this.mailSender.createMimeMessage();

            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, "UTF-8");
            messageHelper.setFrom(credentialsUsername, sender);
            messageHelper.setSubject(emailMessageDTO.getSubject());
            messageHelper.setText(emailMessageDTO.getText());
            messageHelper.setTo(emailMessageDTO.getReceivers().toArray(String[]::new));

            if (emailMessageDTO.getAttachmentsName() != null) {
                List<String> attachments = new ArrayList<>(emailMessageDTO.getAttachmentsName());
                String folder = attachments.get(0);
                attachments.remove(0);

                for (String attachment : attachments) {
                    File file = new File(folder + "/" + attachment);
                    messageHelper.addAttachment(Objects.requireNonNull(attachment), file);
                }
            }

            mailSender.send(messageHelper.getMimeMessage());

            if (emailMessageDTO.getAttachmentsName() != null) {
                File file = new File(emailMessageDTO.getAttachmentsName().get(0));
                FileUtils.deleteDirectory(file);
            }

        } catch (IOException | MessagingException e) {
            throw new MessageNotSendException(e.getMessage());
        }
    }

    @Override
    public void send(String fileName, String receiver, String subject, String message, ByteArrayOutputStream bos) throws MessagingException {
        log.info("Enter into send method with emailTo - {}, subject - {}", receiver, subject);

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
        fileBodyPart.setFileName(fileName);
        multipart.addBodyPart(fileBodyPart);

        mimeMessage.setContent(multipart);
        this.mailSender.send(mimeMessage);
    }

    @Async
    @Override
    public void send(final String emailTo, final String subject, TemporarySchedule temporarySchedule, final String emailTemplate) throws MessagingException
    {

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

    @Override
    public List<String> uploadFiles(MultipartFile[] files) throws IOException {
        List<String> filesName = new ArrayList<>();
        String uploadDir = System.getProperty("java.io.tmpdir") + "/" + UUID.randomUUID();
        filesName.add(uploadDir);

            for(MultipartFile file: files) {
                String originalFileName = URLDecoder.decode(Objects.requireNonNull(file.getOriginalFilename()), StandardCharsets.UTF_8);
                File transferFile = new File(uploadDir + "/" + originalFileName);
                file.transferTo(transferFile);
                filesName.add(originalFileName);
            }

        return filesName;
    }

}
