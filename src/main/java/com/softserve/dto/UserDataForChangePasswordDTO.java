package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserDataForChangePasswordDTO {
    @JsonProperty(value = "password")
    private String currentPassword;
    @JsonProperty(value = "new_password")
    private String newPassword;
}
