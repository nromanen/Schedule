package com.softserve.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@FilterDef(name="subjectDisableFilter", parameters={
        @ParamDef( name="disable", type="boolean" ),
})

@Filters( {
        @Filter(name="subjectDisableFilter", condition="disable = :disable"),
} )
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

    @Column(name = "disable",  columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
