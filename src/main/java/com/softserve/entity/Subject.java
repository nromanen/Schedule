package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;

@NoArgsConstructor
@Data
@Entity
@Table(name = "subjects")
public class Subject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 5, max = 35, message = "Name must be between 5 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String name;

    @NotEmpty(message = "Type cannot be empty")
    @Size(min = 2, max = 35, message = "Type must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String type;
}
