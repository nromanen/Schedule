package com.softserve.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

@Setter
@Getter
@ToString
@Entity
@EqualsAndHashCode
@Table(name = "teachers")
public class Teacher implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 2, max = 35, message = "Name must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String name;

    @NotEmpty(message = "Surname cannot be empty")
    @Size(min = 2, max = 35, message = "Surname must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String surname;

    @NotEmpty(message = "Patronymic cannot be empty")
    @Size(min = 2, max = 35, message = "Patronymic must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String patronymic;

    @NotEmpty(message = "Position cannot be empty")
    @Size(min = 2, max = 35, message = "Position must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String position;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "disable", columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
