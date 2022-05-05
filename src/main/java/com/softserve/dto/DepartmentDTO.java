package com.softserve.dto;

import lombok.*;

@Getter
@Setter
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DepartmentDTO {
    private Long id;
    private String name;
    private boolean disable;
}
