package com.softserve.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Locale;
import java.util.Map;

@Slf4j
public class Translator {
    private static Translator translator;

    private Map<String, Map<Locale, String>> dictionary = null;

    public Translator(Map<String, Map<Locale, String>> dictionary) {
        this.dictionary = dictionary;
    }

    public String getTranslation(String key, Locale language) {
        if(dictionary.containsKey(key) && dictionary.get(key).containsKey(language)) {
            return  dictionary.get(key).get(language);
        }
        log.warn("There is no translation of the word = {}", key);
        return key;
    }

    public static Translator getInstance() {
        if(translator == null) {
            ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext
                    ("applicationContext.xml");
            translator = (Translator) context.getBean("translator");
            context.close();
        }
        return translator;
    }
}
