package com.softserve.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

@FilterDef(name = "subjectDisableFilter", parameters = {
        @ParamDef(name = "disable", type = Boolean.class),
})

@Filter(name = "subjectDisableFilter", condition = "disable = :disable")

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "subjects")
@EqualsAndHashCode
public class Subject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 2, max = 80, message = "Name must be between 2 and 80 characters long")
    @Column(unique = true, length = 80, nullable = false)
    @NotNull
    private String name;

    @Column(name = "disable", columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
