package com.softserve.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;


@TypeDef(
        typeClass = JsonBinaryType.class,
        defaultForType = JsonNode.class
)
@NoArgsConstructor
@Data
@Entity
@Table(name = "teacher_wishes")
public class TeacherWishes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    private Integer teacher_id;

    private Integer semester_id;

    @Column(name = "wishlist", columnDefinition = "json")
    private JsonNode wishList;

}
