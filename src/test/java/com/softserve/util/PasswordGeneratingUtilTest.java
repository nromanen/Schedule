package com.softserve.util;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@Tag("unit")
class PasswordGeneratingUtilTest {

    @Test
    void testGeneratePassword() {
        assertThat(PasswordGeneratingUtil.generatePassword())
                .matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[!@#$%^&*]).{8,}$");
    }

    @Test
    void testIfEveryTimeGeneratedPasswordIsNew() {
        assertThat(PasswordGeneratingUtil.generatePassword()).isNotEqualTo(PasswordGeneratingUtil.generatePassword());
    }
}
