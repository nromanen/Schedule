package com.softserve.entity;

import com.softserve.entity.enums.LessonType;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Min;
import java.io.Serializable;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "lessons")
public class Lesson implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Min(1)
    private int hours;

    @Column(name = "teacher_for_site")
    private String teacherForSite;

    @Column(name = "subject_for_site")
    private String subjectForSite;

    @Enumerated(EnumType.STRING)
    private LessonType lessonType;

    @ManyToOne(targetEntity = Teacher.class)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @ManyToOne(targetEntity = Subject.class)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne(targetEntity = Group.class)
    @JoinColumn(name = "group_id")
    private Group group;

}
