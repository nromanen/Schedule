delete from de3rldngv565ak."public".users;
delete from de3rldngv565ak."public".teachers;

insert into de3rldngv565ak."public".teachers(id, name, patronymic, "position", surname) VALUES
(4, 'Ivan', 'Ivanovych', 'docent', 'Ivanov'),
(5, 'Petro', 'Petrovych', 'doctor','Petrov'),
(6, 'Dmytro', 'Dmytrovych','aspirant', 'Dmytryk'),
(7, 'Pavlo', 'Pavlovych', 'aspirant', 'Pavlov');

insert into de3rldngv565ak."public".users(id, email, password, role) VALUES
(5,'second@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER'),
(6,'third@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER'),
(7,'fourth@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER'),
(8,'fives@mail.com', '$2a$04$SpUhTZ/SjkDQop/Zvx1.seftJdqvOploGce/wau247zQhpEvKtz9.', 'ROLE_USER');