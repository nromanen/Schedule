package com.softserve.util;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;


@Tag("unit")
@ExtendWith(MockitoExtension.class)
public class TranslatorTest {
    @Spy
    private HashMap<String, HashMap<Locale, String>> dictionary;

    @Spy
    @InjectMocks
    private Translator translator;

    @BeforeEach
    public void setUp() {
        dictionary.clear();

        dictionary.put("word", new HashMap<>() {{
            put(Locale.ENGLISH, "word");
            put(Locale.GERMAN, "wort");
            put(Locale.ITALIAN, "parola");
        }});
        dictionary.put("car", new HashMap<>() {{
            put(Locale.ENGLISH, "car");
            put(Locale.GERMAN, "auto");
            put(Locale.UK, "macchina");
        }});
        dictionary.put("language", new HashMap<>() {{
            put(Locale.ENGLISH, "language");
            put(Locale.GERMAN, "sprache");
            put(Locale.ITALIAN, "linguaggio");
        }});
    }

    @Test
    public void getTranslateTest() {
        String wordForTranslate = "word";
        Locale languageForTranslate = Locale.ITALIAN;
        String expectedWord = "parola";

        String result = translator.getTranslation(wordForTranslate, languageForTranslate);

        assertEquals(expectedWord, result);
    }

    @Test
    public void getTranslateIfLanguageNotExistsTest() {
        String wordForTranslate = "word";
        Locale languageForTranslate = Locale.FRANCE;
        String expectedWord = "word";

        String result = translator.getTranslation(wordForTranslate, languageForTranslate);

        assertEquals(expectedWord, result);
    }

    @Test
    public void getTranslateIfWordNotExistsTest() {
        String wordForTranslate = "java";
        Locale languageForTranslate = Locale.ENGLISH;
        String expectedWord = "java";

        String result = translator.getTranslation(wordForTranslate, languageForTranslate);

        assertEquals(expectedWord, result);
    }
}
