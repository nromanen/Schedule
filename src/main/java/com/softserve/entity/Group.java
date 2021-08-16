package com.softserve.entity;

import com.opencsv.bean.CsvBindByName;
import lombok.*;
import org.hibernate.annotations.OrderBy;
import org.hibernate.annotations.*;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "groups")
@Builder(toBuilder = true)

@FilterDef(name="groupDisableFilter", parameters={
        @ParamDef( name="disable", type="boolean" ),
})

@Filters( {
        @Filter(name="groupDisableFilter", condition="disable = :disable"),
} )

public class Group implements Serializable {
    @EqualsAndHashCode.Include
    @ToString.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @EqualsAndHashCode.Include
    @ToString.Include
    @NotEmpty(message = "Title cannot be empty")
    @Size(min = 2, max = 35, message = "Title must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false, unique = true)
    @NotNull
    @CsvBindByName(column = "group")
    private String title;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @NotNull
    @OneToMany(mappedBy = "group")
    @OrderBy(clause = "surname ASC")
    private List<Student> students = new ArrayList<>();

    @EqualsAndHashCode.Include
    @ToString.Include
    @Column(name = "disable",  columnDefinition = "boolean default 'false'")
    private boolean disable = false;

}
