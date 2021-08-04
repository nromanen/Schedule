delete from "public".lessons;
delete from "public".teachers;
delete from "public".groups;
delete from "public".subjects;

insert into "public".subjects(id, name) VALUES
(4, 'Biology'),
(5, 'History'),
(6, 'Astronomy');

insert into "public".teachers(id, name, patronymic, "position", surname) VALUES
(4, 'Ivan', 'Ivanovych', 'docent', 'Ivanov'),
(5, 'Petro', 'Petrovych', 'doctor','Petrov'),
(6, 'Dmytro', 'Dmytrovych','aspirant', 'Dmytryk'),
(7, 'Pavlo', 'Pavlovych', 'aspirant', 'Pavlov');

insert into "public".groups(id, title) values
(4,'111'),
(5,'222'),
(6,'333');

insert into "public".lessons(id, hours, lessontype, subject_for_site, link_to_meeting, group_id, subject_id, teacher_id) VALUES
(4, 1, 'LECTURE', '', '', 4, 4, 4),
(5, 1, 'LABORATORY', '', '', 5, 5, 5),
(6, 2, 'LABORATORY', '', '', 4, 5, 6),
(7, 2, 'PRACTICAL', '', '', 6, 6, 6);