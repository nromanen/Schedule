TRUNCATE
    "public".groups,
    "public".students,
    "public".users
    RESTART IDENTITY
    CASCADE;

insert into users(id, email, password, role) values (10, 'teacher@gmail.com', 'Pass1233!', 'ROLE_TEACHER');
insert into users(id, email, password, role) values (11, 'Third@test.com', 'Pass1233!', 'ROLE_STUDENT');
insert into users(id, email, password, role) values (12, 'Fourth@test.com', 'Pass1233!', 'ROLE_TEACHER');
insert into users(id, email, password, role) values (13, 'Five@test.com', 'Pass1233!', 'ROLE_STUDENT');
insert into users(id, email, password, role) values (14, 'Six@test.com', 'Pass1233!', 'ROLE_STUDENT');
insert into users(id, email, password, role) values (15, 'Seven@test.com', 'Pass1233!', 'ROLE_TEACHER');
insert into users(id, email, password, role) values (16, 'romaniuk@gmail.com', 'Pass1233!', 'ROLE_TEACHER');
insert into users(id, email, password, role) values (17, 'student@gmail.com', 'Pass1233!', 'ROLE_STUDENT');
insert into users(id, email, password, role) values (18, 'aware.123db@gmail.com', 'Pass1233!', 'ROLE_STUDENT');
insert into users(id, email, password, role) values (19, 'tempStudent@gmail.com', 'Pass1233!', 'ROLE_STUDENT');

insert into "public".groups(id, title, disable) values
(1, 'First Title', false),
(2, 'Second Title', false);

insert into "public".students(id, name, surname, patronymic, group_id, user_id) values
(8, 'First Name1', 'First Surname1', 'First Patronymic1', 1, 18),
(9, 'First Name2', 'First Surname2', 'First Patronymic2', 1, 17),
(10, 'Hanna', 'Romaniuk', 'Stepanivna', 1, 16),
(13, 'Six', 'Six', 'Six', 1, 14);

insert into "public".students(id, name, surname, patronymic, group_id) values
(11, 'Second', 'Second', 'Second', 1),
(12, 'Five', 'Five', 'Five', 1),
(14, 'Seven', 'Seven', 'Seven', 1);

