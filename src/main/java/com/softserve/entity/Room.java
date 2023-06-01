package com.softserve.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.softserve.entity.interfaces.SortableOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;


@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "rooms")

@FilterDef(name = "roomDisableFilter", parameters = {
        @ParamDef(name = "disable", type = boolean.class),
})

@Filter(name = "roomDisableFilter", condition = "disable = :disable")

public class Room implements Serializable, SortableOrder {
    @Serial
    private static final long serialVersionUID = 2833932227648855541L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Name cannot be empty")
    @Size(min = 2, max = 35, message = "Name must be between 2 and 35 characters long")
    @Column(length = 35, nullable = false)
    private String name;

    @ManyToOne(targetEntity = RoomType.class)
    @JoinColumn(name = "room_type_id")
    private RoomType type;

    @Column(name = "disable", columnDefinition = "boolean default 'false'")
    private boolean disable = false;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
