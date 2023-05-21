package com.softserve.entity;

import com.softserve.entity.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;


@NamedQuery(
        name = "findEmail",
        query = "from User u where u.email= :email"
)
@NamedQuery(
        name = "findToken",
        query = "from User u where u.token= :token"
)
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "users")
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = -3083575163596074583L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Email(message = "must be a well-formed email address")
    @Size(min = 5, max = 40)
    @Column(unique = true, length = 40)
    @NotEmpty(message = "Email cannot be empty")
    private String email;

    @NotNull
    @NotEmpty(message = "Password cannot be empty")
    private String password;

    @Column(length = 20, columnDefinition = "varchar(32) default 'ROLE_USER'")
    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;

    private String token;
}
