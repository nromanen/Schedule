TRUNCATE
    "public".groups,
    "public".students
    RESTART IDENTITY
    CASCADE;

insert into "public".groups(id, title, disable)
values(1, 'First Title', false);

insert into "public".students(id, name, surname, patronymic, email, group_id) values
(4, 'First Name1', 'First Surname1', 'First Patronymic1', 'aware.123db@gmail.com', 1),
(5, 'First Name2', 'First Surname2', 'First Patronymic2', 'student@gmail.com', 1),
(6, 'Hanna', 'Romaniuk', 'Stepanivna', 'romaniuk@gmail.com', 1);                                                                              ;                                                                                  ;

