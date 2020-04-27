package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class ScheduleForRoomDTO {
    @JsonProperty("room_id")
    private Long roomId;

    @JsonProperty("room_name")
    private String roomName;

    @JsonProperty("room_type")
    private String roomType;

    private List<DaysOfWeekWithClassesForRoomDTO> schedules;
}
