package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ScheduleForGroupDTO {
    private GroupDTO group;
    private List<DaysOfWeekWithClassesDTO> days;
}
