package com.softserve.dto;

import com.softserve.entity.enums.RoomSize;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoomDTO {
    private Long id;
    private RoomSize roomSize;
    private String name;
}
