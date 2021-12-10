package com.softserve.service;

import com.softserve.dto.EmailMessageDTO;
import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;

public interface MailService {
    void send(String receiver, String subject, String message);

    void send(String sender, EmailMessageDTO emailMessageDTO);

    void send(String fileName, String receiver, String subject, String message, ByteArrayOutputStream bos) throws MessagingException;
}
