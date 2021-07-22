package com.softserve.entity.enums;


public enum Language {
    UK,
    EN;

    public static Language getLanguage(String language) {
        return valueOf(language.toUpperCase());
    }
}
