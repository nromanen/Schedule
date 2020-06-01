delete from de3rldngv565ak."public".rooms;
delete from de3rldngv565ak."public".room_types;

insert into de3rldngv565ak."public".room_types(id, description) values
(4,'small auditory'),
(5,'medium auditory'),
(6, 'big auditory');

insert into de3rldngv565ak."public".rooms(id, name, room_type_id) values
(4, 'Laboratory', 4),
(5, 'Practical room', 5),
(6, 'Lecture room', 6);