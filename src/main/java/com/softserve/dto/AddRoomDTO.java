package com.softserve.dto;

import com.softserve.entity.enums.RoomSize;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddRoomDTO {
    private RoomSize roomSize;
    String name;
}
