package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@ToString
@EqualsAndHashCode
public class ScheduleForRoomDTO implements Serializable {
    @JsonProperty("room_id")
    private Long roomId;

    @JsonProperty("room_name")
    private String roomName;

    @JsonProperty("room_type")
    private String roomType;

    private List<DaysOfWeekWithClassesForRoomDTO> schedules;
}
