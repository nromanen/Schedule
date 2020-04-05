package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomForScheduleDTO {
    private Long id;
    private String name;
    private String type;
    private boolean isAvailable;
}
