package com.softserve.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class CombinedRoomScheduleDTO {
    // TODO: replace SemesterWithGroupsDTO with a lightweight SemesterLightDTO
    //  containing only id, description, year to reduce response payload
    private List<SemesterWithGroupsDTO> semesters;
    private Map<Long, List<ScheduleForRoomDTO>> roomsBySemesterId;
}
