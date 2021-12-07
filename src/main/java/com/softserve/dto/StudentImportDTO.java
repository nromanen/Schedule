package com.softserve.dto;

import com.softserve.dto.enums.ImportSaveStatus;
import lombok.Data;

@Data
public class StudentImportDTO {
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private String email;
    private GroupDTO groupDTO;
    private ImportSaveStatus importSaveStatus;
}
