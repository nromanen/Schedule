package com.softserve.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class LessonInScheduleByWeekDTO {
    private LessonsInScheduleDTO even;
    private LessonsInScheduleDTO odd;

}
