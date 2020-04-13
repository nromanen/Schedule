package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class LessonInScheduleByWeekDTO {
    private LessonsInScheduleDTO even;
    private LessonsInScheduleDTO odd;

}
