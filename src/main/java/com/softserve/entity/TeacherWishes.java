package com.softserve.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;


@TypeDef(
        typeClass = JsonBinaryType.class,
        defaultForType = JsonNode.class
)

@Entity
@Table(name = "teacher_wishes")
@EqualsAndHashCode(exclude = { "teacher"}) // This,
@ToString(exclude = { "teacher"}) // and this

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler","teacher"})
public class TeacherWishes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    @JsonIgnore
    private Teacher teacher;

    @Column(name = "wishlist", columnDefinition = "json default '{}'")
    private JsonNode wishList;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public JsonNode getWishList() {
        return wishList;
    }

    public void setWishList(JsonNode wishList) {
        this.wishList = wishList;
    }
}
