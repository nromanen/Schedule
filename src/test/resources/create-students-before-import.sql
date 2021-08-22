TRUNCATE
    "public".groups
    RESTART IDENTITY
    CASCADE;

insert into "public".groups(id, title, disable)
values(1, 'First Title', false);