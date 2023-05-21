package com.softserve.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.validation.constraints.NotBlank;
import java.io.Serial;
import java.io.Serializable;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@FilterDef(name = "departmentDisableFilter", parameters = {
        @ParamDef(name = "disable", type = boolean.class),
})
@Filter(name = "departmentDisableFilter", condition = "disable = :disable")
public class Department implements Serializable {
    @Serial
    private static final long serialVersionUID = 2766226747907729715L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
