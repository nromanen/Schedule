package com.softserve.exception;

public class AuthGoogleEmailDontExistException extends RuntimeException{
    public AuthGoogleEmailDontExistException(String message, String email){super(message + email);}
}
