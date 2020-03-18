package com.softserve.entity;

import com.softserve.entity.enums.RoomSize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "rooms")
@AllArgsConstructor
public class Room implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Enumerated(EnumType.STRING)
    private RoomSize roomSize;

    @Column(unique = true)
    String name;
}
