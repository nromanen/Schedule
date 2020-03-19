package com.softserve.entity;

import com.vladmihalcea.hibernate.type.json.JsonStringType;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;


@TypeDef(name = "json", typeClass = JsonStringType.class)
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

    @Type(type = "json")
    @Column(name = "wishlist",columnDefinition = "json")
    private String wishList;
}
