package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomForScheduleInfoDTO {
    private Long id;
    private String name;
    private RoomTypeDTO type;
    private boolean isAvailable;
}
