package com.softserve.util;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Slf4j
public class Translator {

    private static HashMap<String, HashMap<Locale, String>> words = null;
    private static final String FILE_NAME = "translator.json";

    private Translator() {}

    public static String getTranslation(String key, Locale language) {
        if(words == null)
            words = readWords();
        if(words.containsKey(key) && words.get(key).containsKey(language)) {
            return  words.get(key).get(language);
        }
        log.warn("There is no translation of the word = {}", key);
        return key;
    }

    private static HashMap<String, HashMap<Locale, String>> readWords() {
        ObjectMapper objectMapper = new ObjectMapper();
        JavaType innerMapType = objectMapper.getTypeFactory()
                .constructMapType(Map.class ,Locale.class, String.class);
        JavaType stringType = objectMapper.getTypeFactory()
                .constructType(String.class);
        JavaType wordsMapType = objectMapper.getTypeFactory()
                .constructMapType(HashMap.class, stringType, innerMapType);
        try {
            File file = ResourceUtils.getFile("classpath:" + FILE_NAME);
            return objectMapper.readValue(file, wordsMapType);
        }
        catch (IOException ex) {
            log.error(ex.getMessage(), ex);
            return new HashMap<>();
        }
    }
}
