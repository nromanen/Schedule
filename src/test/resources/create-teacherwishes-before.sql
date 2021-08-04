delete from "public".lessons;
delete from "public".teacher_wishes;
delete from "public".teachers;

insert into "public".teachers(id, name, patronymic, "position", surname) VALUES
(4, 'Ivan', 'Ivanovych', 'docent', 'Ivanov'),
(5, 'Petro', 'Petrovych', 'doctor','Petrov');