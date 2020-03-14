package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "teacher_wishes")
public class TeacherWishes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @ManyToOne(targetEntity = Teacher.class)
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Teacher teacher;

    @ManyToOne(targetEntity = Semester.class)
    @JoinColumn(name = "semester_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Semester semester;

//    @Type(type = "jsonb")
//    @Column(columnDefinition = "json")
//    private String wishlist;
}
