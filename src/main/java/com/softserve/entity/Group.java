package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "groups")
public class Group implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @NotEmpty(message = "Title cannot be empty")
    @Size(min = 2, max = 35, message = "Title must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false, unique = true)
    @NotNull
    private String title;
}
