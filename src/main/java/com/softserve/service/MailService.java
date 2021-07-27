package com.softserve.service;
import com.softserve.entity.TemporarySchedule;
import javax.mail.MessagingException;

public interface MailService {
    void send(String receiver, String subject, String message);
    void send(final String emailTo, final String subject, TemporarySchedule temporarySchedule, final String emailTemplate) throws MessagingException;
}
