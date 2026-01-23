package com.softserve.dto;

import com.softserve.dto.enums.ImportSaveStatus;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
public class StudentImportDTO implements Serializable {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String email;
    private GroupDTO groupDTO;
    private ImportSaveStatus importSaveStatus;
}
