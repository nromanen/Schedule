package com.softserve.util;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Slf4j
@NoArgsConstructor
public class Translator {
    private static Translator translator;

    private Map<String, Map<Locale, String>> dictionary = new HashMap<>();

    public static Translator getInstance() {
        if (translator == null) {
            ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            try (InputStream inputStream = new ClassPathResource("dictionary.yaml").getInputStream()) {
                translator = mapper.readValue(inputStream, Translator.class);
            } catch (IOException e) {
                log.error("Error occurred while parsing file dictionary.yaml", e);
                translator = new Translator();
            }
        }
        return translator;
    }

    public String getTranslation(String key, Locale language) {
        if (dictionary.containsKey(key) && dictionary.get(key).containsKey(language)) {
            return dictionary.get(key).get(language);
        }
        log.warn("There is no translation of the word = {}", key);
        return key;
    }
}
