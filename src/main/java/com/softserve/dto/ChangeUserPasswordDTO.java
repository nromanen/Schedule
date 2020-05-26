package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ChangeUserPasswordDTO {
    @JsonProperty(value = "old_password")
    private String oldPassword;
    @JsonProperty(value = "new_password")
    private String newPassword;
}
