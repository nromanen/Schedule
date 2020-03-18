package com.softserve.entity;

import com.softserve.entity.enums.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User implements Serializable {
    private static final String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "serial")
    private long id;

    @Pattern(regexp = EMAIL_PATTERN, message = "Wrong email")
    @Column(unique = true, length = 40)
    private String email;

    @NotEmpty(message = "Name cannot be empty")
    //@Size(min = 2, max = 32, message = "Name must be between 2 and 32 characters long")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;
}
