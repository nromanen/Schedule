package com.softserve.entity;

import com.opencsv.bean.CsvBindByName;
import com.softserve.entity.interfaces.SortableOrder;
import lombok.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity(name = "StudentGroup")
@EqualsAndHashCode
@Table(name = "groups")
@Builder(toBuilder = true)
public class Group implements Serializable, SortableOrder {
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
    @OrderBy("surname ASC")
    @Builder.Default
    private List<Student> students = new ArrayList<>();

    @Builder.Default
    @Column(name = "disable", columnDefinition = "boolean default 'false'")
    private boolean disable = false;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
