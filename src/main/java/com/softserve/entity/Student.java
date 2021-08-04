package com.softserve.entity;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvRecurse;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@NoArgsConstructor
@Data
@Entity
@Table(name = "students")
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 2, max = 35, message = "Name must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    @CsvBindByName
    private String name;

    @NotEmpty(message = "Surname cannot be empty")
    @Size(min = 2, max = 35, message = "Surname must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    @CsvBindByName
    private String surname;

    @NotEmpty(message = "Patronymic cannot be empty")
    @Size(min = 2, max = 35, message = "Patronymic must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    @CsvBindByName
    private String patronymic;

    @Email
    @Size(min = 5, max = 40)
    @Column(unique = true, length = 40)
    @NotEmpty(message = "Email cannot be empty")
    @CsvBindByName
    private String email;

    @Nullable
    @Column(name ="user_id")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    @NotNull
    @CsvRecurse
    private Group group;
}