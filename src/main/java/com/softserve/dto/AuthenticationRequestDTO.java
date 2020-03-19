package com.softserve.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class AuthenticationRequestDTO implements Serializable {
    private String username;
    private String password;
}

