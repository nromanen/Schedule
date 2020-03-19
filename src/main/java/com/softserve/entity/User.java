package com.softserve.entity;

import com.softserve.entity.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "serial")
    private long id;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;
}
