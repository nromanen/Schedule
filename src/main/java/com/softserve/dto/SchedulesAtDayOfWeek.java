package com.softserve.dto;

import com.softserve.entity.Schedule;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.List;

@Data
@NoArgsConstructor
public class SchedulesAtDayOfWeek {
    private DayOfWeek dayOfWeek;
    private List<Schedule> schedules;
}
