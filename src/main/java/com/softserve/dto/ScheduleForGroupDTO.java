package com.softserve.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ScheduleForGroupDTO {
    private GroupDTO group;
    private List<DaysOfWeekWithClassesForGroupDTO> days;
}
