package com.softserve.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;

@NoArgsConstructor
@Data
@Entity
@Table(name = "periods")
public class Period implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @NotEmpty(message = "Start time cannot be empty")
    @Column(name = "start_time")
    private Timestamp startTime;

    @NotEmpty(message = "End time cannot be empty")
    @Column(name = "end_time")
    private Timestamp endTime;

    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 2, max = 35, message = "Name must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String name;
}
