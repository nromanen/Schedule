TRUNCATE
    "public".users
    RESTART IDENTITY
    CASCADE;

insert into "public".users(id, email, password, role, activated) VALUES
(4,'first@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_MANAGER', true),
(5,'second@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER', true),
(6,'third@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER', true),
(7,'fourth@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER', true),
(8,'fives@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER', true),
(9,'sixth@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER', true);