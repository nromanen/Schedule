package com.softserve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class StudentWithoutGroupDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String email;
}
