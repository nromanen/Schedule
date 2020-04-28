package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.Filters;
import org.hibernate.annotations.ParamDef;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "groups")

@FilterDef(name="groupDisableFilter", parameters={
        @ParamDef( name="disable", type="boolean" ),
})

@Filters( {
        @Filter(name="groupDisableFilter", condition="disable = :disable"),
} )

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

    @Column(name = "disable",  columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
