## SET_SHEDULE_SEMESTER_ID

-   call from submitSearchSchedule

## SET_SCHEDULE_TYPE

-   sheduleType by default is ''
-   setSheduleTypeService('default') , 'default' makes no sense

## semester

-   Global semesters is equal to shedule.semesters
-   currentSemester and defaultSemester should contain in only

## shedule

-   clean teacherShedule when switch to another scheduleType
-   teacherShedule, fullSchedule and groupSchedule hava unnecessary semester property
-   teacherShedule.teacher
-   teacherShedule and (fullSchedule, groupSchedule) have different schemas
-   schedules copied to state directly from a request

refactor schedule state
