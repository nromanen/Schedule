package com.softserve.entity;

import lombok.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

@NoArgsConstructor
@ToString
@Getter
@Setter
@Entity
@EqualsAndHashCode
@Table(name = "room_types")
public class RoomType implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Description cannot be empty")
    @Size(min = 2, max = 40, message = "Description must be between 2 and 40 characters long")
    @Column(unique = true, length = 40, nullable = false)
    @NotNull
    private String description;
}
