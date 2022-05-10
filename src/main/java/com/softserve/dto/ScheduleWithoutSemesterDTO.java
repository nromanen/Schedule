package com.softserve.dto;

import com.softserve.entity.enums.EvenOdd;
import lombok.*;

import java.time.DayOfWeek;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@ToString
public class ScheduleWithoutSemesterDTO {
    private Long id;
    private DayOfWeek dayOfWeek;
    private EvenOdd evenOdd;
    private LessonInfoDTO lesson;
    private PeriodDTO period;
    private RoomDTO room;
}
