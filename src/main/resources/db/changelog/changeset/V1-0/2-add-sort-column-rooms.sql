--liquibase formatted sql

--changeset Alexander Karabush: 2-add-sort-column-rooms
alter table rooms add sort_order double precision;

create sequence sort_order_sequence;

update rooms
set sort_order = t.new_sort_order
    from(
    select id, nextval('sort_order_sequence') as new_sort_order
    from rooms
    order by "name"
    ) t
where t.id = rooms.id;
