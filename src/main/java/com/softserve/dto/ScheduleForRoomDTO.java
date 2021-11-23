package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@ToString
@EqualsAndHashCode
public class ScheduleForRoomDTO {

    private RoomDTO room;

    private List<DaysOfWeekWithClassesForRoomDTO> schedules;
}
