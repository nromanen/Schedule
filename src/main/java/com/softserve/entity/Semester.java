package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@NamedQuery(
        name = "findDescriptionAndYear",
        query = "from Semester s where s.description= :description and s.year= :year"
)
@NamedQuery(
        name = "findCurrentSemester",
        query = "from Semester s where s.currentSemester= :currentSemester"
)

@NoArgsConstructor
@Data
@Entity
@Table(name = "semesters")
public class Semester implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @NotBlank(message = "Description cannot be null or empty")
    private String description;

    @Min(1999)
    private int year;

    @Column(name = "start_day")
    @NotNull(message = "Start time cannot be empty")
    private LocalDate startDay;

    @Column(name = "end_day")
    @NotNull(message = "End time cannot be empty")
    private LocalDate endDay;

    @Column(name = "current_semester", columnDefinition = "boolean default 'false'")
    private boolean currentSemester = false;
}
