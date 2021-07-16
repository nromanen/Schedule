package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.TreeSet;

@Data
public class SemesterDTO {
    private long id;
    private String description;
    private int year;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate startDay;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate endDay;
    private boolean currentSemester;
    @JsonProperty("semester_days")
    private TreeSet<DayOfWeek> daysOfWeek;
    @JsonProperty("semester_classes")
    private LinkedHashSet<PeriodDTO> periods;
    @JsonProperty("semester_groups")
    private LinkedHashSet<GroupDTO> groups;
    private boolean disable;
}
