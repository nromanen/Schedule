create table users
(
    id           serial primary key,
    username     varchar(100) unique,
    first_name   varchar(100),
    last_name    varchar(100),
    email        varchar(100) ,
    phone_number varchar(20) ,
    password     varchar(255),
    status       varchar(20)
);
create table roles
(
    id   serial primary key,
    name varchar(100)
);
create table user_roles
(
    user_id bigint,
    role_id bigint,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
    FOREIGN KEY ("role_id") REFERENCES "roles" ("id")
);