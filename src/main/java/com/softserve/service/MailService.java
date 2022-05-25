package com.softserve.service;

import com.softserve.dto.EmailMessageDTO;
import com.softserve.entity.TemporarySchedule;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;

public interface MailService {

    /**
     * Method for sending message from server to user
     *
     * @param receiver to whom the message will be sent
     * @param subject  the subject of the message
     * @param message  message from the letter
     */
    void send(String receiver, String subject, String message);

    /**
     * Method for sending message from user to different emails
     *
     * @param sender          from whom the message will be sent
     * @param emailMessageDTO message that will be sent
     */
    void send(String sender, EmailMessageDTO emailMessageDTO);

    void send(String fileName, String receiver, String subject, String message, ByteArrayOutputStream bos) throws MessagingException;

    void send(final String emailTo, final String subject, TemporarySchedule temporarySchedule, final String emailTemplate) throws MessagingException;
}
