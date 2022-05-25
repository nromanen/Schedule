package com.softserve.service;

import com.softserve.dto.*;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.LessonType;

import javax.mail.MessagingException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public interface ScheduleService extends BasicService<Schedule, Long> {

    /**
     * Method create List of schedules in accordance to grouped lessons
     *
     * @param schedule Schedule entity with grouped lesson
     * @return List of schedules for grouped lessons
     */
    List<Schedule> schedulesForGroupedLessons(Schedule schedule);

    List<Schedule> getSchedulesForGroupedLessons(Schedule schedule);

    void checkReferences(Schedule schedule);

    /**
     * Method returns necessary info to finish saving schedule
     *
     * @param semesterId the semester id in which schedule have to be saved
     * @param dayOfWeek  the semester id in which schedule have to be saved
     * @param evenOdd    lesson occurs by EVEN/ODD/WEEKLY
     * @param classId    period id in which schedule have to be saved
     * @param lessonId   lesson id that pretends t be saved
     * @return CreateScheduleInfoDTO - necessary info to finish saving schedule
     */
    CreateScheduleInfoDTO getInfoForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);

    /**
     * Verifies if group has conflict in schedule when it saves
     *
     * @param semesterId
     * @param dayOfWeek
     * @param evenOdd
     * @param classId
     * @param lessonId
     * @return
     */
    boolean isConflictForGroupInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId, Long lessonId);

    /**
     * Method gets full schedule for groups in particular semester
     *
     * @param semesterId id of semester
     * @param groupId    group id
     * @return filled schedule for group
     */
    List<ScheduleForGroupDTO> getFullScheduleForGroup(Long semesterId, Long groupId);

    /**
     * Method gets full schedule for groups in particular semester
     *
     * @param semesterId id of semester
     * @return filled schedule for all groups that have any lessons in that semester
     */
    ScheduleFullDTO getFullScheduleForSemester(Long semesterId);

    /**
     * Method gets full schedule for teacher in particular semester
     *
     * @param semesterId id of semester
     * @param teacherId  id of teacher
     * @return filled schedule for teacher
     */
    ScheduleForTeacherDTO getScheduleForTeacher(Long semesterId, Long teacherId);

    List<Schedule> getAllSchedulesByTeacherIdAndSemesterId(Long teacherId, Long semesterId);

    List<Schedule> getSchedulesBySemester(Long semesterId);

    /**
     * Method temporaryScheduleByDateRangeForTeacher get all schedules and temporary schedules from db in particular date range
     * temporaryScheduleByDateRangeForTeacher
     *
     * @param fromDate  LocalDate from
     * @param toDate    LocalDate to
     * @param teacherId id teacher
     * @return list of schedules and temporary schedules
     */
    Map<LocalDate, Map<Period, Map<Schedule, TemporarySchedule>>> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    /**
     * Method deleteSchedulesBySemesterId delete all schedules from db in with current semesterId
     *
     * @param semesterId id Semester for delete schedule
     */
    void deleteSchedulesBySemesterId(Long semesterId);

    /**
     * Method saveScheduleDuringCopy save Schedule in db
     *
     * @param schedule Schedule entity for save schedule in db
     * @return Schedule entity after saved in db
     */
    Schedule saveScheduleDuringCopy(Schedule schedule);

    /**
     * Method updateWithoutChecks update Schedule in db
     *
     * @param schedule Schedule entity for update schedule in db
     * @return Schedule entity after update in db
     */
    Schedule updateWithoutChecks(Schedule schedule);

    /**
     * Method counts schedule records in db for lesson by lessonsId
     *
     * @param lessonId id of the lesson
     * @return number of records in db
     */
    Long countInputLessonsInScheduleByLessonId(Long lessonId);

    /**
     * Method return boolean value for schedule records in db by lessonsId, periodId, EvenOdd and DayOfWeek
     *
     * @param lessonId id of the lesson
     * @param periodId id of the Period
     * @param evenOdd  Even/Odd
     * @param day      day of Week
     * @return true if count equals 0 and false in another case
     */
    boolean isLessonInScheduleByLessonIdPeriodIdEvenOddDayOfWeek(Long lessonId, Long periodId, EvenOdd evenOdd, DayOfWeek day);

    /**
     * The method used for sending schedules to teachers
     *
     * @param semesterId semester for schedule
     * @param teachersId id of teachers to whom we need to send the schedule
     */
    void sendScheduleToTeachers(Long semesterId, Long[] teachersId, Locale language);

    /**
     * The method used for sending schedules to one teacher
     *
     * @param semesterId semester for schedule
     * @param teacherId  id of teacher to which we need to send the schedule
     */
    void sendScheduleToTeacher(Long semesterId, Long teacherId, Locale language) throws MessagingException;

    /**
     * The method is used for getting list of schedules grouped by rooms
     *
     * @param semesterId Id of Semester
     * @return grouped List of schedule's list
     */
    Map<Room, List<Schedule>> getAllOrdered(Long semesterId);
}

