package com.softserve.entity;

import com.opencsv.bean.CsvBindByName;
import lombok.*;
import org.hibernate.annotations.*;
import org.hibernate.annotations.OrderBy;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@ToString
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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @NotEmpty(message = "Title cannot be empty")
    @Size(min = 2, max = 35, message = "Title must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false, unique = true)
    @NotNull
    @CsvBindByName(column = "group")
    private String title;

    @NotNull
    @OneToMany(mappedBy = "group", fetch = FetchType.EAGER)
    @OrderBy(clause = "surname ASC")
    private List<Student> students = new ArrayList<>();

    @Column(name = "disable",  columnDefinition = "boolean default 'false'")
    private boolean disable = false;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Group group = (Group) o;
        return disable == group.disable && id.equals(group.id) && title.equals(group.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, disable);
    }
}
