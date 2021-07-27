package com.softserve.dto;

import lombok.Data;

@Data
public class StudentDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String email;
    private Long user_id;
    private GroupDTO group;
}
