package com.softserve.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ScheduleFullDTO implements Serializable {
    private SemesterDTO semester;

    @EqualsAndHashCode.Exclude
    private List<ScheduleForGroupDTO> schedule;
}
