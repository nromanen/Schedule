package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "employee")
public class Employee implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "position")
    private String position;

}
