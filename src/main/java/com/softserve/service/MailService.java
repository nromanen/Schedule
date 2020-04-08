package com.softserve.service;

public interface MailService {
    void send(String receiver, String subject, String message);
}
