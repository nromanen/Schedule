package com.softserve.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateScheduleInfoDTO {
    private boolean isTeacherAvailable;
    private List<RoomForScheduleInfoDTO> rooms;
}
