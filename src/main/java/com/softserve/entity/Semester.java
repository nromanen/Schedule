package com.softserve.entity;

import lombok.*;
import org.hibernate.annotations.*;
import org.hibernate.annotations.NamedQuery;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

@NamedQuery(
        name = "findCurrentSemester",
        query = "from Semester s where s.currentSemester= :currentSemester"
)

@FilterDef(name="semesterDisableFilter", parameters={
        @ParamDef( name="disable", type="boolean" ),
})

@Filters( {
        @Filter(name="semesterDisableFilter", condition="disable = :disable"),
} )


@NoArgsConstructor
@Getter
@Setter
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

    @ElementCollection(targetClass = DayOfWeek.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name="semester_day")
    @Column(name = "day")
    @NotNull(message = "At least one day should persist in the semester")
    private Set<DayOfWeek> daysOfWeek;

    @NotNull(message = "Semester should contain at least one period")
    @ManyToMany
    @JoinTable(name = "semester_period",
            joinColumns = { @JoinColumn(name = "semester_id")},
            inverseJoinColumns = {@JoinColumn(name = "period_id")})
    @OrderBy("startTime")
    private Set<Period> periods;

    @Column(name = "disable",  columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
