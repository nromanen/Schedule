package com.softserve.exception;

import lombok.Getter;

@Getter
public class SortingOrderNotExistsException extends RuntimeException{

    private String shortMessage;

    public SortingOrderNotExistsException(Class<?> clazz, Long id) {
        super(clazz.getSimpleName() + " with id " + id + " does not exists or have not set sorting order");
        this.shortMessage = clazz.getSimpleName() +  " was not found or have not set sorting order";
    }
}
