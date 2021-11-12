TRUNCATE
    "public".students,
    "public".users,
    "public".groups
    RESTART IDENTITY
    CASCADE;

insert into "public".groups(id, title, disable, sorting_order) values
(4,'444', false, 2),
(5,'555', true, null),
(6, '666', false, 1);

insert into "public".students(id, email, name, patronymic, surname, group_id) values
(4, 'zzz1@gmail.com', 'Name One', 'Patron One', 'Surname One', 4);
