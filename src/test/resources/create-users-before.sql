delete from testschedule."public".users;

insert into testschedule."public".users(id, email, password, role) VALUES
(4,'first@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_MANAGER'),
(5,'second@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER'),
(6,'third@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER'),
(7,'fourth@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER'),
(8,'fives@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER');