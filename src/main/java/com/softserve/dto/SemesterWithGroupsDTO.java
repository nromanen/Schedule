package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.TreeSet;

@Data
public class SemesterWithGroupsDTO {
    private long id;
    private String description;
    private int year;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate startDay;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate endDay;
    private boolean currentSemester;
    private boolean defaultSemester;
    @JsonProperty("semester_days")
    private TreeSet<DayOfWeek> daysOfWeek;
    @JsonProperty("semester_classes")
    private LinkedHashSet<PeriodDTO> periods;
    @JsonProperty("semester_groups")
    private LinkedList<GroupDTO> groups;
    private boolean disable;
}
