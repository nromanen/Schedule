package com.softserve.exception;

public class DeleteDisabledException extends RuntimeException {
    public DeleteDisabledException(Class<?> clazz) {
        super("Cannot delete " + clazz.getSimpleName().toLowerCase() + ": record is referenced by other entities");
    }

    public DeleteDisabledException(String message) {
        super(message);
    }
}
