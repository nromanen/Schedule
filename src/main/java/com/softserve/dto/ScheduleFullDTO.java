package com.softserve.dto;

import com.softserve.entity.Group;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ScheduleFullDTO {
    private List<ScheduleForGroupDTO> schedule;
}
