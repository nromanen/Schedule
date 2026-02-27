package com.softserve.service.impl;

import com.softserve.dto.EmailMessageDTO;
import com.softserve.exception.MessageNotSendException;
import com.softserve.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Objects;

@Service
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine springTemplateEngine;
    @Value("${app.mail.sender}")
    private String credentialsUsername;
    @Value("${app.mail.enabled:true}")
    private boolean enabled;

    @Autowired
    public MailServiceImpl(JavaMailSender mailSender,
                           SpringTemplateEngine springTemplateEngine) {
        this.mailSender = mailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    @Async
    @Override
    public void send(String receiver, String subject, String message) {
        log.info("Enter into send method with receiver {}, subject {}", receiver, subject);

        if (enabled) {
            try {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setFrom(credentialsUsername);
                mailMessage.setTo(receiver);
                mailMessage.setSubject(subject);
                mailMessage.setText(message);
                mailSender.send(mailMessage);
            } catch (Exception e) {
                log.error("Failed to send email to {}", receiver, e);
            }
        }
    }


    @Override
    public void send(String sender, EmailMessageDTO emailMessageDTO) {
        log.info("Enter into send method with sender - {}, emailMessageDTO - {}", sender, emailMessageDTO);
        try {
            MimeMessage message = this.mailSender.createMimeMessage();

            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, "UTF-8");
            messageHelper.setFrom(credentialsUsername, sender);
            messageHelper.setSubject(emailMessageDTO.getSubject());
            messageHelper.setText(emailMessageDTO.getText());
            messageHelper.setTo(emailMessageDTO.getReceivers().toArray(String[]::new));

            if (emailMessageDTO.getAttachments() != null) {
                for (MultipartFile attachment : emailMessageDTO.getAttachments()) {
                    messageHelper.addAttachment(Objects.requireNonNull(attachment.getOriginalFilename()), attachment);
                }
            }

            mailSender.send(messageHelper.getMimeMessage());
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
}
