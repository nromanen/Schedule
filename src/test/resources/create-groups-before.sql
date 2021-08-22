TRUNCATE
    "public".students,
    "public".users,
    "public".groups
    RESTART IDENTITY
    CASCADE;

insert into "public".groups(id, title, disable) values
(4,'444', false),
(5,'555', false),
(6,'666', true),
(7,'777', false);

insert into "public".users(id, email, password, role) VALUES
(4,'first@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_MANAGER'),
(5,'second@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER'),
(6,'third@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER'),
(7,'fourth@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_TEACHER'),
(8,'fives@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER');

insert into "public".students(id, email, name, patronymic, surname, group_id) values
(1, 'zzz1@gmail.com', 'Name One', 'Patron One', 'Surname One', 4),
(2, 'qqq2@gmail.com', 'Name Two', 'Patron Two', 'Surname Two', 5),
(3, 'www3@gmail.com', 'Name Three', 'Patron Three', 'Surname Three', 5),
(4, 'eee4@gmail.com', 'Name Four', 'Patron Four', 'Surname Four', 6),
(5, 'rrr5@gmail.com', 'Name Five', 'Patron Five', 'Surname Five', 6);
