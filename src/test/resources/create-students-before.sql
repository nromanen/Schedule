TRUNCATE
    "public".groups,
    "public".students,
    "public".users
    RESTART IDENTITY
    CASCADE;

insert into users(id, email, password, role, activated) values (10, 'teacher@gmail.com', 'Pass1233!', 'ROLE_TEACHER', true);
insert into users(id, email, password, role, activated) values (11, 'Second@test.com', 'Pass1233!', 'ROLE_STUDENT', true);
insert into users(id, email, password, role, activated) values (12, 'Fourth@test.com', 'Pass1233!', 'ROLE_STUDENT', true);
insert into users(id, email, password, role, activated) values (13, 'Five@test.com', 'Pass1233!', 'ROLE_TEACHER', true);
insert into users(id, email, password, role, activated) values (14, 'romaniuk@gmail.com', 'Pass1233!', 'ROLE_TEACHER', true);
insert into users(id, email, password, role, activated) values (15, 'student@gmail.com', 'Pass1233!', 'ROLE_STUDENT', true);
insert into users(id, email, password, role, activated) values (16, 'aware.123db@gmail.com', 'Pass1233!', 'ROLE_STUDENT', true);
insert into users(id, email, password, role, activated) values (17, 'tempStudent@gmail.com', 'Pass1233!', 'ROLE_STUDENT', true);

insert into "public".groups(id, title, disable) values
                                                    (1, 'First Title', false),
                                                    (2, 'Second Title', false);

insert into "public".students(id, name, surname, patronymic, group_id, user_id) values
                                                                                    (8, 'First Name1', 'First Surname1', 'First Patronymic1', 1, 16),
                                                                                    (9, 'First Name2', 'First Surname2', 'First Patronymic2', 1, 15),
                                                                                    (10, 'Hanna', 'Romaniuk', 'Stepanivna', 1, 14),
                                                                                    (12, 'Fourth', 'Fourth', 'Fourth', 1, 12);
