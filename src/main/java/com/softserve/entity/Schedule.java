package com.softserve.entity;

import com.softserve.entity.enums.EvenOdd;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
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
    @Column(name = "day_of_week")
    private String dayOfWeek;

    @Enumerated(EnumType.STRING)
    private EvenOdd evenOdd;

    @ManyToOne(targetEntity = Semester.class)
    @JoinColumn(name = "semester_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Semester semester;

    @ManyToOne(targetEntity = Room.class)
    @JoinColumn(name = "room_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Room room;

    @ManyToOne(targetEntity = Period.class)
    @JoinColumn(name = "period_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Period period;

    @ManyToOne(targetEntity = Lesson.class)
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Lesson lesson;
}
