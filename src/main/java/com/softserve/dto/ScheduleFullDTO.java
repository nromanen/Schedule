package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.softserve.entity.Group;
import com.softserve.entity.Period;
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
    @JsonProperty("semester_days")
    private List<DayOfWeek> semesterDays;
    @JsonProperty("semester_classes")
    private List<PeriodDTO> semesterClasses;
    private List<ScheduleForGroupDTO> schedule;
}
