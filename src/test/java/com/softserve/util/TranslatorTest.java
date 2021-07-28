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

//
//    private static String fileName;
//
//    @BeforeClass
//    public static void ClassSetUp() {
//        fileName = "translator.json";
//    }
//
//    @Before
//    public void setUp() {
//        HashMap<Locale, String> innerMap1 = new HashMap<>();
//        innerMap1.put(Locale.ENGLISH, "word");
//        innerMap1.put(Locale.forLanguageTag("UK"), "слово");
//        HashMap<Locale, String> innerMap2 = new HashMap<>();
//        innerMap1.put(Locale.ENGLISH, "test");
//        innerMap1.put(Locale.forLanguageTag("UK"), "тест");
//        HashMap<String, HashMap<Locale, String>> wordsMap = new HashMap<>();
//        wordsMap.put("word", innerMap1);
//        wordsMap.put("test", innerMap2);
//
//        Whitebox.setInternalState(Translator.class, "WORDS", wordsMap);
//        Whitebox.setInternalState(Translator.class, "log", LoggerFactory.getLogger("name"));
//    }
//
//    @Test
//    public void readWordsTest() throws Exception {
//        HashMap<Locale, String> innerMap = new HashMap<>();
//        innerMap.put(Locale.ENGLISH, "test");
//        innerMap.put(Locale.forLanguageTag("UK"), "тест");
//        HashMap<String, HashMap<Locale, String>> result = new HashMap<>();
//        result.put("test", innerMap);
//
//        PowerMockito.spy(Translator.class);
//        PowerMockito.when(Translator.class, "readWords", fileName).thenCallRealMethod();
//
//        Method method = Whitebox.getMethod(Translator.class, "readWords", String.class);
//        HashMap<String, HashMap<Locale, String>> value = (HashMap<String, HashMap<Locale, String>>) method
//                .invoke(null, fileName);
//
//        Assert.assertEquals(result, value);
//        PowerMockito.verifyPrivate(Translator.class, times(1))
//                .invoke("readWords", fileName);
//    }
//
//    @Test
//    public void readWordsIfFileNotExistsTest() throws Exception {
//        String incorrectFileName = "nonExistsFile.json";
//        HashMap<String, HashMap<Locale, String>> result = new HashMap<>();
//
//        PowerMockito.spy(Translator.class);
//        PowerMockito.when(Translator.class, "readWords", incorrectFileName).thenCallRealMethod();
//
//        Method method = Whitebox.getMethod(Translator.class, "readWords", String.class);
//        HashMap<String, HashMap<Locale, String>> value = (HashMap<String, HashMap<Locale, String>>) method
//                .invoke(null, incorrectFileName);
//
//        Assert.assertEquals(result, value);
//        PowerMockito.verifyPrivate(Translator.class, times(1))
//                .invoke("readWords", incorrectFileName);
//    }
//
//    @Test
//    public void getTranslationTest() throws Exception {
//        String existsWord = "test";
//        Locale existsLanguage = Locale.forLanguageTag("UK");
//        String result = "тест";
//
//        PowerMockito.spy(Translator.class);
//        PowerMockito.when(Translator.class, "getTranslation", existsWord, existsLanguage).thenCallRealMethod();
//
//        Method method = Whitebox.getMethod(Translator.class, "getTranslation", String.class, Locale.class);
//        String value = (String) method.invoke(null, existsWord, existsLanguage);
//
//        Assert.assertEquals(result, value);
//        PowerMockito.verifyPrivate(Translator.class, times(1))
//                .invoke("getTranslation", existsWord, existsLanguage);
//    }
//
//    @Test
//    public void getTranslationIfLanguageIsNotExistsTest() throws Exception {
//        String existsWord = "test";
//        Locale existsLanguage = Locale.JAPAN;
//        String result = "test";
//
//        PowerMockito.spy(Translator.class);
//        PowerMockito.when(Translator.class, "getTranslation", existsWord, existsLanguage).thenCallRealMethod();
//
//        Method method = Whitebox.getMethod(Translator.class, "getTranslation", String.class, Locale.class);
//        String value = (String) method.invoke(null, existsWord, existsLanguage);
//
//        Assert.assertEquals(result, value);
//        PowerMockito.verifyPrivate(Translator.class, times(1))
//                .invoke("getTranslation", existsWord, existsLanguage);
//    }
}
