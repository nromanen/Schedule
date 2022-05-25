package com.softserve.service;

import com.softserve.dto.EmailMessageDTO;
import com.softserve.entity.TemporarySchedule;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;

public interface MailService {
    void send(String receiver, String subject, String message);

    void send(String sender, EmailMessageDTO emailMessageDTO);

    void send(String fileName, String receiver, String subject, String message, ByteArrayOutputStream bos) throws MessagingException;

    void send(final String emailTo, final String subject, TemporarySchedule temporarySchedule, final String emailTemplate) throws MessagingException;
}
