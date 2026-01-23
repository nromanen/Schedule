package com.softserve.dto;

import com.softserve.entity.enums.EvenOdd;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.time.DayOfWeek;

@ToString
@Getter
@Setter
@NoArgsConstructor
public class ScheduleSaveDTO implements Serializable {
    private Long id;
    private Long periodId;
    private Long lessonId;
    private Long roomId;
    private DayOfWeek dayOfWeek;
    private EvenOdd evenOdd;
}
