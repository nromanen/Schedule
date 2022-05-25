package com.softserve.repository;

import com.softserve.entity.*;

import java.time.LocalDate;
import java.util.List;

public interface TemporaryScheduleRepository extends BasicRepository<TemporarySchedule, Long> {

    /**
     * Method counts temporary schedule records in db for date and vacation  in the semester
     *
     * @param date
     * @param semesterId
     * @param vacation
     * @return number of records in db
     */
    Long isExistTemporaryScheduleByVacationByDate(LocalDate date, Long semesterId, boolean vacation);

    /**
     * Method counts temporary schedule records in db for date and vacation  in the semester
     *
     * @param date, semesterId, vacation
     * @return number of records in db
     */
    Long isExistTemporaryScheduleByVacationByDateWithIgnoreId(Long id, LocalDate date, Long semesterId, boolean vacation);

    /**
     * Method counts temporary schedule records in db for date and vacation  in the semester
     *
     * @param date, semesterId, vacation
     * @return number of records in db
     */
    Long isExistTemporaryScheduleByVacationByDateAndTeacher(LocalDate date, Long semesterId, Long teacherId, boolean vacation);

    /**
     * Method counts temporary schedule records in db for date and vacation  in the semester
     *
     * @param date, semesterId, vacation
     * @return number of records in db
     */
    Long isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(Long id, LocalDate date, Long semesterId, Long teacherId, boolean vacation);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param object
     * @return number of records in db
     */
    Long isExistTemporarySchedule(TemporarySchedule object, boolean vacation);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param object
     * @return number of records in db
     */
    Long isExistTemporaryScheduleByDateAndScheduleId(TemporarySchedule object, boolean vacation);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param object
     * @return number of records in db
     */
    Long isExistTemporaryScheduleByDateAndScheduleIdWithIgnoreId(TemporarySchedule object, boolean vacation);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param object
     * @return number of records in db
     */
    Long isExistTemporaryScheduleWithIgnoreId(TemporarySchedule object);

    /**
     * Method scheduleByDateRangeForTeacher get all schedules from db in particular date range
     *
     * @param fromDate  LocalDate from
     * @param toDate    LocalDate to
     * @param teacherId id teacher
     * @return list of schedules
     */
    List<TemporarySchedule> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param
     * @return number of records in db
     */
    List<TemporarySchedule> getAllBySemesterAndRange(Long semesterId, LocalDate fromDate, LocalDate toDate);

    /**
     * Method counts temporary schedule records in db for teacher
     *
     * @param teacherId, fromDate, toDate
     * @return number of records in db
     */
    List<TemporarySchedule> getAllByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param semesterId
     * @return number of records in db
     */
    List<TemporarySchedule> getAllBySemester(Long semesterId);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param
     * @return number of records in db
     */
    List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate);

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param fromDate, toDate, teacherId, semesterId
     * @return number of records in db
     */
    List<TemporarySchedule> vacationByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate);

    /**
     * Method deleteTemporarySchedulesBySemesterId delete all temporarySchedule from db in with current semesterId
     *
     * @param semesterId id Semester for delete TemporarySchedule
     */
    void deleteTemporarySchedulesBySemesterId(Long semesterId);
}
