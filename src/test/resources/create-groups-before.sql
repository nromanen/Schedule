TRUNCATE
    "public".students,
    "public".users,
    "public".groups
    RESTART IDENTITY
    CASCADE;

insert into "public".groups(id, title, disable) values
(4,'444', false),
(5,'555', true);

insert into "public".students(id, email, name, patronymic, surname, group_id) values
(4, 'zzz1@gmail.com', 'Name One', 'Patron One', 'Surname One', 4);
