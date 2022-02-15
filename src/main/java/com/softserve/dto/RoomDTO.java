package com.softserve.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomDTO {
    private Long id;
    private String name;
    private boolean disable = false;
    private RoomTypeDTO type;
}
