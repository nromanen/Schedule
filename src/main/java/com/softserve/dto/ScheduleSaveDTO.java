package com.softserve.dto;

import com.softserve.entity.enums.EvenOdd;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;

@Getter
@Setter
@NoArgsConstructor
public class ScheduleSaveDTO {
    private Long id;
    private Long semesterId;
    private Long periodId;
    private DayOfWeek dayOfWeek;
    private EvenOdd evenOdd;
    private Long lessonId;
    private Long roomId;

}
