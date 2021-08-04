delete from "public".schedules;
delete from "public".lessons;
delete from "public".students;
delete from "public".groups;

insert into "public".groups(id, title, disable) values
(4,'444', false),
(5,'555', false),
(6,'666', true),
(7,'777', false);


insert into "public".students(id, email, name, patronymic, surname, user_id, group_id) values
(1, 'zzz1@gmail.com', 'Name One', 'Patron One', 'Surname One', 1, 4),
(2, 'qqq2@gmail.com', 'Name Two', 'Patron Two', 'Surname Two', 2, 5),
(3, 'www3@gmail.com', 'Name Three', 'Patron Three', 'Surname Three', 3, 5),
(4, 'eee4@gmail.com', 'Name Four', 'Patron Four', 'Surname Four', 4, 6),
(5, 'rrr5@gmail.com', 'Name Five', 'Patron Five', 'Surname Five', 5, 6);
