delete from "schedule-test".public.lessons;
delete from "schedule-test".public.teacher_wishes;
delete from "schedule-test".public.teachers;
delete from "schedule-test".public.department;
delete from "schedule-test".public.users;

insert into "schedule-test".public.department(id, name) values (20, 'Department1');

insert into "schedule-test".public.users(id, email, password) values (20, 'teacher@gmail.com', 'Pass1233!');

insert into "schedule-test".public.teachers(id, name, patronymic, position, surname, department_id, user_id)
values (1, 'Ivan', 'Ivanovych', 'docent', 'Ivanov', 20, 20);

insert into "schedule-test".public.teachers(id, name, patronymic, position, surname, department_id, disable)
values (2, 'Ivan', 'Ivanovych', 'docent', 'Ivanov', 20, true);
