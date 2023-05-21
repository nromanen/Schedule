package com.softserve.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.NamedQuery;
import org.hibernate.annotations.OrderBy;
import org.hibernate.annotations.ParamDef;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serial;
import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

@NamedQuery(
        name = "findCurrentSemester",
        query = "from Semester s where s.currentSemester= :currentSemester"
)

@NamedQuery(
        name = "findDefaultSemester",
        query = "from Semester s where s.defaultSemester= :defaultSemester"
)

@FilterDef(name = "semesterDisableFilter", parameters = {
        @ParamDef(name = "disable", type = boolean.class),
})

@Filter(name = "semesterDisableFilter", condition = "disable = :disable")

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "semesters")
public class Semester implements Serializable {
    @Serial
    private static final long serialVersionUID = -4025578014137316818L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(name = "default_semester", columnDefinition = "boolean default 'false'")
    private boolean defaultSemester = false;

    @ElementCollection(targetClass = DayOfWeek.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "semester_day")
    @Column(name = "day")
    @NotNull(message = "At least one day should persist in the semester")
    private Set<DayOfWeek> daysOfWeek;

    @NotNull(message = "Semester should contain at least one period")
    @ManyToMany
    @JoinTable(name = "semester_period",
               joinColumns = {@JoinColumn(name = "semester_id")},
               inverseJoinColumns = {@JoinColumn(name = "period_id")})
    @OrderBy(clause = "startTime")
    private Set<Period> periods;

    @ManyToMany
    @JoinTable(name = "semester_group",
            joinColumns = {@JoinColumn(name = "semester_id")},
            inverseJoinColumns = {@JoinColumn(name = "group_id")})
    @OrderBy(clause = "sort_order")
    private Set<Group> groups;

    @Column(name = "disable", columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
