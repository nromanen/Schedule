package com.softserve.dto;

import com.softserve.entity.Schedule;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SchedulesAtDayOfWeek implements Serializable {
    private DayOfWeek dayOfWeek;
    private List<Schedule> schedules;
}
