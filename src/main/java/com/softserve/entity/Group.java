package com.softserve.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import com.opencsv.bean.CsvBindByName;
import com.softserve.entity.interfaces.SortableOrder;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.OrderBy;
import org.hibernate.annotations.ParamDef;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
@EqualsAndHashCode
@Table(name = "groups")
@Builder(toBuilder = true)
@FilterDef(name = "groupDisableFilter", parameters = {
        @ParamDef(name = "disable", type = boolean.class),
})
@Filter(name = "groupDisableFilter", condition = "disable = :disable")
public class Group implements Serializable, SortableOrder {
    @Serial
    private static final long serialVersionUID = -7125488487122270781L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @Builder.Default
    private List<Student> students = new ArrayList<>();

    @Builder.Default
    @Column(name = "disable", columnDefinition = "boolean default 'false'")
    private boolean disable = false;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
