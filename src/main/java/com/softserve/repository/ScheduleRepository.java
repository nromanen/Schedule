package com.softserve.repository;

import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends BasicRepository<Schedule, Long> {

    /**
     * Method searches if there are any saved records in schedule for particular group
     *
     * @param semesterId the semester id that the search is performed for
     * @param dayOfWeek  the day of the week that the search is performed for
     * @param evenOdd    lesson should occur by EVEN/ODD/WEEKLY
     * @param classId    id for period that the search is performed for
     * @param groupId    group id for which the search is performed for
     * @return 0 if there are no records(conflicts), else number of records
     */
    Long conflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long groupId);

    /**
     * Method gets the count of records in Schedule table for teacher if teacher has Schedule at some semester at some day(by even odd week) for some period
     *
     * @param semesterId id of semester
     * @param dayOfWeek  day of the week
     * @param evenOdd    even/odd/weekly
     * @param classId    id of period
     * @param teacherId  id of the teacher
     * @return the count of records in Schedule table
     */
    Long conflictForTeacherInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long teacherId);

    /**
     * Method gets the list of unique groups in semester
     *
     * @param semesterId id of semester
     * @return list of unique groups in semester
     */
    List<Group> uniqueGroupsInScheduleBySemester(Long semesterId);

    /**
     * Method gets the list of periods/classes for group in some semester at some day
     *
     * @param semesterId id of the semester
     * @param groupId    id of the group
     * @param day        day of the week
     * @return the list of periods/classes
     */
    List<Period> periodsForGroupByDayBySemester(Long semesterId, Long groupId, DayOfWeek day);

    /**
     * Method gets Lesson for group in some semester at some day(even/odd) at some period/class
     *
     * @param semesterId id of the semester
     * @param groupId    id of the group
     * @param periodId   id of the period/class
     * @param day        day of the week
     * @param evenOdd    even/odd/weekly
     * @return Optional Lesson object
     */
    Optional<Lesson> lessonForGroupByDayBySemesterByPeriodByWeek(Long semesterId, Long groupId, Long periodId, DayOfWeek day, EvenOdd evenOdd);

    /**
     * Method gets Room for Lesson in some semester at some day(even/odd) at some period/class
     *
     * @param semesterId id of the semester
     * @param periodId   id of the period/class
     * @param lessonId   id of the lesson
     * @param day        day of the week
     * @param evenOdd    even/odd/weekly
     * @return Room object
     */
    Room getRoomForLesson(Long semesterId, Long periodId, Long lessonId, DayOfWeek day, EvenOdd evenOdd);

    /**
     * Method gets unique days when Group have classes in semester
     *
     * @param semesterId id of the semester
     * @param groupId    id of the group
     * @return List of days
     */
    List<DayOfWeek> getDaysWhenGroupHasClassesBySemester(Long semesterId, Long groupId);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param semesterId id of the semester
     * @param groupId    id og the group
     * @return number of records in db
     */
    Long countSchedulesForGroupInSemester(Long semesterId, Long groupId);

    /**
     * Method gets unique days when Teacher has classes in semester
     *
     * @param semesterId id of the semester
     * @param teacherId  id of the teacher
     * @return List of days
     */
    List<DayOfWeek> getDaysWhenTeacherHasClassesBySemester(Long semesterId, Long teacherId);

    /**
     * Method gets the list of periods/classes for teacher in some semester at some day
     *
     * @param semesterId id of the semester
     * @param teacherId  id of the teacher
     * @param day        day of the week
     * @return the list of periods/classes
     */
    List<Period> periodsForTeacherBySemesterByDayByWeek(Long semesterId, Long teacherId, DayOfWeek day, EvenOdd evenOdd);

    /**
     * Method gets Lesson for teacher in some semester at some day(even/odd) at some period/class
     *
     * @param semesterId id of the semester
     * @param teacherId  id of the group
     * @param periodId   id of the period/class
     * @param day        day of the week
     * @param evenOdd    even/odd/weekly
     * @return Optional Lesson object
     */
    List<Lesson> lessonsForTeacherBySemesterByDayByPeriodByWeek(Long semesterId, Long teacherId, Long periodId, DayOfWeek day, EvenOdd evenOdd);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    /**
     * Method gets schedule by schedule all schedule parameters
     *
     * @param schedule schedule with parameters
     * @return List of all schedules
     */
    Schedule getScheduleByObject(Schedule schedule);

    /**
     * Method gets all schedules from db in particular semester
     *
     * @param semesterId id of the semester
     * @return list of schedules
     */
    List<Schedule> getScheduleBySemester(Long semesterId);

    /**
     * Method scheduleForRoomBySemester get all schedules for specific  room and  semester
     *
     * @param semesterId
     * @param roomId
     * @return list of schedules
     */
    List<Schedule> scheduleForRoomBySemester(Long semesterId, Long roomId);

    /**
     * Method scheduleByDateRangeForTeacher get all schedules from db in particular date range
     *
     * @param fromDate  LocalDate from
     * @param toDate    LocalDate to
     * @param teacherId id teacher
     * @return list of schedules
     */
    List<Schedule> scheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    /**
     * Method deleteSchedulesBySemesterId delete all schedules from db in with current semesterId
     *
     * @param semesterId id Semester for delete schedule
     */
    void deleteSchedulesBySemesterId(Long semesterId);

    /**
     * Method counts schedule records in db for lesson by lessonsId
     *
     * @param lessonId id of the lesson
     * @return count of records in db
     */
    Long countInputLessonsInScheduleByLessonId(Long lessonId);

    /**
     * Method counts schedule records in db for lesson by lessonsId, periodId, EvenOdd and DayOfWeek
     *
     * @param lessonId id of the lesson
     * @param periodId id of the Period
     * @param evenOdd  Even/Odd
     * @param day      day of Week
     * @return count of records in db
     */
    Long countByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day);

    List<Schedule> getAllOrdered(Long semesterId);
}
