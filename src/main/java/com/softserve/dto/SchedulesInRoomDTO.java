package com.softserve.dto;

import com.softserve.entity.Room;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class SchedulesInRoomDTO {
    private Room room;
    private List<SchedulesAtDayOfWeek> schedules;
}
