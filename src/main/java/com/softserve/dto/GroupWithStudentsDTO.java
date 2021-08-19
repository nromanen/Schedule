package com.softserve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupWithStudentsDTO {
    private Long id;
    private String title;
    private List<StudentWithoutGroupDTO> students;
}
