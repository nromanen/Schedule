package com.softserve.exception;

public class DeleteDisabledException extends RuntimeException {
    public DeleteDisabledException(String message) {
        super(message);
    }
}
