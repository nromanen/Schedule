package com.softserve.dto;

import com.softserve.entity.Room;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SchedulesInRoomDTO implements Serializable {
    private Room room;
    private List<SchedulesAtDayOfWeek> schedules;
}
