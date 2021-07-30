package com.softserve.util;

import org.passay.CharacterData;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.PasswordGenerator;

public interface PasswordGeneratingUtil {
    CharacterData SPECIAL_CHARS = new CharacterData() {
        public String getErrorCode() {
            return "INSUFFICIENT_SPECIAL";
        }

        public String getCharacters() {
            return "!@#$%^&*";
        }
    };
    int PASSWORD_LENGTH = 30;
    CharacterRule SPECIAL_CHARS_RULE = new CharacterRule(SPECIAL_CHARS);
    CharacterRule LOWER_CASE_RULE = new CharacterRule(EnglishCharacterData.LowerCase);
    CharacterRule DIGIT_RULE = new CharacterRule(EnglishCharacterData.Digit);
    CharacterRule UPPER_CASE_RULE = new CharacterRule(EnglishCharacterData.UpperCase);

    static String generatePassword() {
        return new PasswordGenerator().generatePassword(
                PASSWORD_LENGTH,
                SPECIAL_CHARS_RULE,
                LOWER_CASE_RULE,
                UPPER_CASE_RULE,
                DIGIT_RULE);
    }
}
