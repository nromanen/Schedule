package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "car")
public class Car implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(name = "name")
    private String name;


    @ManyToOne(targetEntity = Employee.class, cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Employee employee;
}
