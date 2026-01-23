package com.softserve.service;

import com.softserve.dto.EmailMessageDTO;

import jakarta.mail.MessagingException;
import java.io.ByteArrayOutputStream;

public interface MailService {

    /**
     * Sends a simple mail message from mail server to user.
     *
     * @param receiver to whom the message will be sent
     * @param subject  the subject of the message
     * @param message  the text of the message
     */
    void send(String receiver, String subject, String message);

    /**
     * Sends a mail message from the given sender.
     *
     * @param sender          from whom the message will be sent
     * @param emailMessageDTO the message that will be sent
     */
    void send(String sender, EmailMessageDTO emailMessageDTO);

    /**
     * Sends a message with given file.
     *
     * @param fileName the name of file to send
     * @param receiver to whom the message will be sent
     * @param subject  the subject of the message
     * @param message  the text of the message
     * @param bos      the byte array output stream
     * @throws MessagingException if an error occurred while sending the letter
     */
    void send(String fileName, String receiver, String subject, String message, ByteArrayOutputStream bos) throws MessagingException;

}
