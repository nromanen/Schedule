TRUNCATE
    "public".groups,
    "public".students
    RESTART IDENTITY
    CASCADE;

insert into "public".groups(id, title, disable)
values(1, 'First Title', false);

insert into "public".students(id, name, surname, patronymic, email, group_id)
values(2, 'First Name', 'First Surname', 'First Patronymic', 'aware.123db@gmail.com', 1);
