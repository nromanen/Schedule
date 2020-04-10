package com.softserve.service.impl;

import com.softserve.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@PropertySource("classpath:mail.properties")
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final Environment environment;

    @Value("${spring.mail.username}")
    private String username;

    @Autowired
    public MailServiceImpl(JavaMailSender mailSender, Environment environment) {
        this.mailSender = mailSender;
        this.environment = environment;
    }


    /**
     * Method for sending message from server to user
     * @param emailTo to whom the message will be sent
     * @param subject the subject of the message
     * @param message message from the letter
     */
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
}