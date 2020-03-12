package com.softserve.entity;

import com.softserve.enums.EvenOdd;
import com.softserve.enums.RoomSize;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "schedule")
public class Schedule implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;
    private String day_of_week;

    @Enumerated(EnumType.STRING)
    private EvenOdd evenOdd;

    @ManyToOne(targetEntity = Semestr.class)
    @JoinColumn(name = "semestr_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Semestr semestr;

    @ManyToOne(targetEntity = Room.class)
    @JoinColumn(name = "room_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Room room;

    @ManyToOne(targetEntity = Class.class)
    @JoinColumn(name = "class_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Class aClass;

    @ManyToOne(targetEntity = Lesson.class)
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Lesson lesson;
}
