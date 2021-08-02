package com.softserve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDTO {
    private Long id;
    private String title;
//    @JsonInclude(NON_EMPTY)
//    private List<StudentDTO> students = new ArrayList<>();
}
