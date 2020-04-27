package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.softserve.entity.Group;
import com.softserve.entity.Period;
import com.softserve.entity.Semester;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.DayOfWeek;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ScheduleFullDTO {
    private SemesterDTO semester;
    private List<ScheduleForGroupDTO> schedule;
}
