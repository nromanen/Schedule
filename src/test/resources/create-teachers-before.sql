delete from de3rldngv565ak."public".lessons;
delete from de3rldngv565ak."public".teacher_wishes;
delete from de3rldngv565ak."public".teachers;

insert into de3rldngv565ak."public".teachers(id, name, patronymic, "position", surname) VALUES
(4, 'Ivan', 'Ivanovych', 'docent', 'Ivanov'),
(5, 'Petro', 'Petrovych', 'doctor','Petrov'),
(6, 'Dmytro', 'Dmytrovych','aspirant', 'Dmytryk'),
(7, 'Pavlo', 'Pavlovych', 'aspirant', 'Pavlov');