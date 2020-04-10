package com.softserve.entity;

import com.softserve.entity.enums.EvenOdd;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "schedules")
public class Schedule implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;


    @Column(name = "day_of_week",length = 35, nullable = false)
    private String dayOfWeek;

    @Enumerated(EnumType.STRING)
    private EvenOdd evenOdd;

    @ManyToOne(targetEntity = Semester.class)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @ManyToOne(targetEntity = Room.class)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne(targetEntity = Period.class)
    @JoinColumn(name = "period_id")
    private Period period;

    @ManyToOne(targetEntity = Lesson.class)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
