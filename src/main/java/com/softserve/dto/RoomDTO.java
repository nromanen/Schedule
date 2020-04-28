package com.softserve.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoomDTO {
    private Long id;
    private String name;
    private boolean disable = false;
    private RoomTypeDTO type;
}
