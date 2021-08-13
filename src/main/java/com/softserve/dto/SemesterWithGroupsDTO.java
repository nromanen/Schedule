package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.LinkedList;

@EqualsAndHashCode(callSuper = true)
@Data
public class SemesterWithGroupsDTO extends SemesterDTO{
    @JsonProperty("semester_groups")
    private LinkedList<GroupDTO> groups;
}
