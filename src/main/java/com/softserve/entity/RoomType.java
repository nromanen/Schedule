package com.softserve.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
