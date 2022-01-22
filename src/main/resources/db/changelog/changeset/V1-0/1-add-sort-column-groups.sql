--liquibase formatted sql

--changeset Alexander Karabush: 1-add-sort-column-groups
alter table groups add sorting_order integer;

create sequence sorting_order_sequence;

update groups
set sorting_order = g.new_sorting_order
    from(
        select id, nextval('sorting_order_sequence') as new_sorting_order
        from groups
        order by "title"
    ) g
where g.id = groups.id;