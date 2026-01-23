package com.softserve.entity;

import com.softserve.entity.interfaces.SortableOrder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.io.Serializable;


@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "rooms")
public class Room implements Serializable, SortableOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 2, max = 35, message = "Name must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    @EqualsAndHashCode.Include
    private String name;

    @ManyToOne(targetEntity = RoomType.class)
    @JoinColumn(name = "room_type_id")
    private RoomType type;

    @Column(name = "disable", columnDefinition = "boolean default 'false'")
    private boolean disable = false;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
