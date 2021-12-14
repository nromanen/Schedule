package com.softserve.service;

import com.softserve.dto.EmailMessageDTO;
import com.softserve.entity.TemporarySchedule;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public interface MailService {
    void send(String receiver, String subject, String message);

    void send(String sender, EmailMessageDTO emailMessageDTO);

    void send(String fileName, String receiver, String subject, String message, ByteArrayOutputStream bos) throws MessagingException;

    void send(final String emailTo, final String subject, TemporarySchedule temporarySchedule, final String emailTemplate) throws MessagingException;

    List<String> uploadFiles(List<MultipartFile> multipartFile) throws IOException;
}
