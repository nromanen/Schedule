package com.softserve.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;


@TypeDef(
        typeClass = JsonBinaryType.class,
        defaultForType = Wishes.class
)
@Setter
@Getter
@Entity
@Table(name = "teacher_wishes")
@EqualsAndHashCode(exclude = {"teacher"})
@ToString(exclude = {"teacher"})

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "teacher"})
public class TeacherWishes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", updatable = false)
    @JsonIgnore
    private Teacher teacher;

    @Column(name = "wishlist")
    private Wishes[] teacherWishesList;
}
