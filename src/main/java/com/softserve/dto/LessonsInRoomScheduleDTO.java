package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LessonsInRoomScheduleDTO {

    private List<LessonsListInRoomScheduleDTO> lessons;
    @JsonProperty("class_id")
    private Long classId;

    @JsonProperty("class_name")
    private String className;

}
