--liquibase formatted sql

--changeset Alexander Karabush: 6-update-userid-column-students
update students
set user_id = u.id
    from(
        select *
        from users
    ) u
where u.email = students.email;