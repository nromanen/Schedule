package com.softserve.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FilterDef(name="departmentDisableFilter", parameters={
        @ParamDef( name="disable", type="boolean" ),
})
@Filter(name="departmentDisableFilter", condition="disable = :disable")
public class Department implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    @EqualsAndHashCode.Include
    private Long id;

    @NotEmpty(message = "Name cannot be empty")
    @Column(nullable = false, unique = true)
    @NotNull
    private String name;

    @Column(columnDefinition = "boolean default 'false'")
    private boolean disable = false;
}
