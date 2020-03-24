package com.softserve.entity;

import com.softserve.entity.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;


@NamedQuery(
        name = "findEmail",
        query = "from User u where u.email= :email"
)

@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Email
    @Size(min=5, max = 40)
    @Column(unique = true, length = 40)
    private String email;

    @NotEmpty(message = "Password cannot be empty")
    private String password;

    @Column(length = 20, columnDefinition = "varchar(32) default 'ROLE_USER'")
    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;
}
