package com.softserve.util;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.HashMap;
import java.util.Locale;

import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class TranslatorTest {
    @Spy
    private HashMap<String, HashMap<Locale, String>> dictionary;

    @Spy
    @InjectMocks
    private Translator translator;

    @Test
    public void getTranslateTest() {
        String word = "word";
        Locale language = Locale.GERMAN;
        String expectedWord = "wort";
        HashMap<Locale, String> map = new HashMap(){{
            put(language, expectedWord);
        }};
        dictionary.put(word, map);

        String result = translator.getTranslation(word, language);

        assertEquals(expectedWord, result);
    }

    @Test
    public void getTranslateIfLanguageNotExistsTest() {
        String expectedWord = "word";
        Locale language = Locale.GERMAN;
        String word = "wort";
        Locale nonExistLanguage = Locale.JAPAN;
        HashMap<Locale, String> map = new HashMap(){{
            put(language, word);
        }};
        dictionary.put(expectedWord, map);

        String result = translator.getTranslation(expectedWord, nonExistLanguage);

        assertEquals(expectedWord, result);
    }
}
