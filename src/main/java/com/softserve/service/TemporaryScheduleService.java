package com.softserve.service;

import com.softserve.entity.Teacher;
import com.softserve.entity.TemporarySchedule;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TemporaryScheduleService extends BasicService<TemporarySchedule, Long> {

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    List<TemporarySchedule> getAllByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId);

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    List<TemporarySchedule> getTemporaryScheduleByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId);

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    List<TemporarySchedule> getAllByCurrentSemester();

    /**
     * The method used for getting all temporary schedules by semesterId
     *
     * @return list of  temporary schedules
     */
    List<TemporarySchedule> getAllBySemesterId(Long semesterId);

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate);

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    List<TemporarySchedule> getAllBySemesterAndRange(Long semesterId, LocalDate fromDate, LocalDate toDate);

    /**
     * The method used for getting all temporary schedules
     *
     * @return list of  temporary schedules
     */
    List<TemporarySchedule> vacationByDateRange(LocalDate fromDate, LocalDate toDate);

    /**
     * The method used for saving temporary schedule in database
     *
     * @param object temporary schedule
     * @return save temporary schedule
     */
    List<String> addRange(LocalDate from, LocalDate to, TemporarySchedule object);

    /**
     * Method deleteTemporarySchedulesBySemesterId delete all temporarySchedule from db in with current semesterId
     *
     * @param semesterId id Semester for delete schedule
     */
    void deleteTemporarySchedulesBySemesterId(Long semesterId);

    public String getTeacherEmailFromTemporarySchedule(Teacher teacher);

    public Teacher getTeacherByScheduleId(Long scheduleId);

    Map<EvenOdd, Map<DayOfWeek, List<TemporarySchedule>>> getTemporaryScheduleForEvenOddWeeks(Long semesterId);
}

