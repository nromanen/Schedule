TRUNCATE
    "public".semester_day,
    "public".semester_period,
    "public".periods,
    "public".semesters
    RESTART IDENTITY
    CASCADE;

insert into "public".periods(id, end_time, name, start_time) VALUES
(4, '2020-04-15 02:00', '1 para', '2020-04-15 01:00'),
(5, '2020-04-15 04:00', '2 para', '2020-04-15 03:00'),
(6, '2020-04-15 06:00', '3 para', '2020-04-15 05:00'),
(7, '1970-01-01 04:00', '4 para', '1970-01-01 03:00');

insert into "public".semesters(id, current_semester, default_semester, description, end_day, start_day, "year", disable) VALUES
(4, true , false, '1 semester', '2020-02-20', '2020-01-20', 2020, false),
(5, false, false, '2 semester', '2020-04-20', '2020-03-20', 2020, false),
(6, false, true , '3 semester', '2020-06-20', '2020-05-20', 2020, false),
(7, false, false, '4 semester', '2020-08-20', '2020-07-20', 2020, false);

insert into "public".semester_day (semester_id, "day") values
(4, 'MONDAY'),
(5, 'FRIDAY'),
(5, 'TUESDAY');

insert into "public".semester_period (semester_id, period_id) values
(4, 4),
(4, 5),
(5, 4);
