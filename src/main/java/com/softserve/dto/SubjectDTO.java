package com.softserve.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SubjectDTO {
    private Long id;
    private String name;
    private boolean disable = false;
}
