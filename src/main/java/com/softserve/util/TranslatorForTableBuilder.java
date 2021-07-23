package com.softserve.util;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.entity.enums.Language;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;

@Slf4j
public class TranslatorForTableBuilder {

    private static final HashMap<String, HashMap<Language, String>> words;

    static {
        words = readWords();
    }

    private TranslatorForTableBuilder() {}

    public static String getWord(String word, Language language) {
        if(words.containsKey(word) && words.get(word).containsKey(language)) {
            return  words.get(word).get(language);
        }
        log.warn("There is no translation of the word = {}", word);
        return word;
    }

    private static HashMap<String, HashMap<Language, String>> readWords() {
        URL url = TranslatorForTableBuilder.class.getResource("/translator.json");
        ObjectMapper objectMapper = new ObjectMapper();
        JavaType hashMapTypeLanguageAndString = objectMapper.getTypeFactory().constructMapType(HashMap.class ,Language.class, String.class);
        JavaType stringType = objectMapper.getTypeFactory().constructType(String.class);
        JavaType hashMapTypeStringAndHashMap = objectMapper.getTypeFactory().constructMapType(HashMap.class, stringType, hashMapTypeLanguageAndString);
        try {
            if(url == null) {
                log.error("file with this name translator.json not found");
                return new HashMap<>();
            }
            File file = new File(url.toURI().getPath());
            return objectMapper.readValue(file ,hashMapTypeStringAndHashMap);
        }
        catch (IOException | URISyntaxException ex) {
            log.error(ex.getMessage());
            return new HashMap<>();
        }
    }
}
