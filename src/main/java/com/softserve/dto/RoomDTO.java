package com.softserve.dto;

import com.softserve.entity.enums.RoomSize;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoomDTO {
    Long id;
    private RoomSize roomSize;
    String name;
}
