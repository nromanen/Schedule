package com.softserve.entity;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;


@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "rooms")
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
    @JoinColumn(name = "room_type_id")
    private RoomType type;

}
