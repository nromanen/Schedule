create sequence sort_order_sequence;

update rooms
set sort_order = t.new_sort_order
from(
 	select id, nextval('sort_order_sequence') as new_sort_order
 	from rooms 
	order by "name"
) t
 where t.id = rooms.id;




create sequence sorting_order_sequence;

update groups
set sorting_order = g.new_sorting_order
from(
 	select id, nextval('sorting_order_sequence') as new_sorting_order
 	from groups 
	order by "title"
) g
 where g.id = groups.id;
