package com.softserve.entity;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.OrderBy;
import org.hibernate.annotations.ParamDef;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "groups")
@Builder(toBuilder = true)
@FilterDef(name="groupDisableFilter", parameters={
        @ParamDef( name="disable", type="boolean" ),
})
@Filter(name="groupDisableFilter", condition="disable = :disable")
public class Group implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @NotEmpty(message = "Title cannot be empty")
    @Size(min = 2, max = 35, message = "Title must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false, unique = true)
    @CsvBindByName(column = "group")
    private String title;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToMany(mappedBy = "group")
    @OrderBy(clause = "surname ASC")
    private List<Student> students = new ArrayList<>();

    @Column(name = "disable",  columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
