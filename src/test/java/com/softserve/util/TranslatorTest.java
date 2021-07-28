package com.softserve.util;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.powermock.reflect.Whitebox;

import java.util.Locale;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Translator.class)
@PowerMockIgnore({"com.sun.org.apache.xerces.*", "javax.xml.*", "org.xml.*", "javax.management.*"})
public class TranslatorTest {

    @Test
    public void readWordsIfFileNotExistsTest() throws Exception {
        String expectedWord = "test";
        Locale language = Locale.ENGLISH;

        Whitebox.setInternalState(Translator.class, "FILE_NAME", "nonExistsFile.json");

        PowerMockito.mockStatic(Translator.class);
        PowerMockito.when(Translator.class, "getTranslation", any(String.class), any(Locale.class)).thenReturn(expectedWord);

        String value = Translator.getTranslation(expectedWord, language);

        Assert.assertEquals(expectedWord, value);

        PowerMockito.verifyStatic(Translator.class, times(2));
        //it just reports which account the call should match
        Translator.getTranslation(expectedWord, language);
    }

    @Test
    public void readWordsTest() throws Exception {
        String expectedWord = "test";
        Locale language = Locale.forLanguageTag("uk");

        PowerMockito.mockStatic(Translator.class);
        PowerMockito.when(Translator.class, "getTranslation", any(String.class), any(Locale.class)).thenReturn(expectedWord);

        String value = Translator.getTranslation(expectedWord, language);

        Assert.assertEquals(expectedWord, value);

        PowerMockito.verifyStatic(Translator.class, times(1));
        //it just reports which account the call should match
        Translator.getTranslation(expectedWord, language);
    }
}
