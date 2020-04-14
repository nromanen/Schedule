delete from testschedule."public".schedules;
delete from testschedule."public".lessons;
delete from testschedule."public".groups;

insert into testschedule."public".groups(id, title) values
(4,'111'),
(5,'222'),
(6,'333');