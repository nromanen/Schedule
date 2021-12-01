package com.softserve.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BadRequestEmailDTO {
    private String status;
    private String email;
}
