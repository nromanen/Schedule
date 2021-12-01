package com.softserve.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentForUpdateListDTO {
    private List<Long> idList;
    private Long groupId;
}
