package com.softserve.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;

@FilterDef(name = "subjectDisableFilter", parameters = {
        @ParamDef(name = "disable", type = boolean.class),
})

@Filter(name = "subjectDisableFilter", condition = "disable = :disable")

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "subjects")
@EqualsAndHashCode
public class Subject implements Serializable {
    @Serial
    private static final long serialVersionUID = -7196116704680097321L;
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
