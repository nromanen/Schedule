package com.softserve.entity;

import lombok.*;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;


@NoArgsConstructor
@Setter
@Getter
@Entity
@EqualsAndHashCode
@Table(name = "rooms")

@FilterDef(name="roomDisableFilter", parameters={
        @ParamDef( name="disable", type="boolean" ),
})

@Filters( {
        @Filter(name="roomDisableFilter", condition="disable = :disable"),
} )

public class Room implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;


    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 2, max = 35, message = "Name must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String name;

    @ManyToOne(targetEntity = RoomType.class)
    @JoinColumn(name = "room_type_id", columnDefinition = "bigint")
    private RoomType type;

    @Column(name = "disable",  columnDefinition = "boolean default 'false'")
    private boolean disable = false;

    @Column(name = "sort_order")
    private Double sortOrder;
}
