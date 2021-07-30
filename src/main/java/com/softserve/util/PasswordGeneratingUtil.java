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

    static String generatePassword() {
        PasswordGenerator generator = new PasswordGenerator();
        CharacterRule lowerCaseRule = new CharacterRule(EnglishCharacterData.LowerCase);
        CharacterRule upperCaseRule = new CharacterRule(EnglishCharacterData.UpperCase);
        CharacterRule digitRule = new CharacterRule(EnglishCharacterData.Digit);
        CharacterRule specialCharsRule = new CharacterRule(SPECIAL_CHARS);
        return generator.generatePassword(
                PASSWORD_LENGTH,
                specialCharsRule,
                lowerCaseRule,
                upperCaseRule,
                digitRule);
    }
}
