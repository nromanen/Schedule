TRUNCATE
    "public".teachers,
    "public".department
    RESTART IDENTITY
    CASCADE;

insert into department(id, name) values
(1, 'Department1'),
(2, 'Department2'),
(3, 'Department3');

insert into teachers(id, name, patronymic, position, surname, department_id)
values (1, 'Ivan', 'Ivanovych', 'docent', 'Ivanov', 1);