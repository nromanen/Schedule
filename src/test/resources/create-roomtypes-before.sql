delete from "public".rooms;
delete from "public".room_types;

insert into "public".room_types(id, description) values
(4, 'small auditory'),
(5, 'medium auditory'),
(6, 'big auditory');