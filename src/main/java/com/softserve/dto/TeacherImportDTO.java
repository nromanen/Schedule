package com.softserve.dto;

import com.softserve.dto.enums.ImportSaveStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherImportDTO extends TeacherWithContactDTO {
    private ImportSaveStatus importSaveStatus;
}
