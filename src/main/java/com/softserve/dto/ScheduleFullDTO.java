package com.softserve.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ScheduleFullDTO {
    private SemesterDTO semester;
    private List<ScheduleForGroupDTO> schedule;
}
