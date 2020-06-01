package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.softserve.entity.Group;
import com.softserve.entity.Period;
import com.softserve.entity.Semester;
import lombok.*;

import java.time.DayOfWeek;
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
