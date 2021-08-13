delete from lessons;
delete from teachers;
delete from department;
delete from users;

insert into department(id, name) values (1, 'Department1');

insert into users(id, email, password) values (1, 'teacher@gmail.com', 'Pass1233!');

insert into teachers(id, name, patronymic, position, surname, department_id, user_id)
values (1, 'Ivan', 'Ivanovych', 'docent', 'Ivanov', 1, 1);

insert into teachers(id, name, patronymic, position, surname, department_id, disable)
values (2, 'Ivan', 'Ivanovych', 'docent', 'Ivanov', 1, true);
