package com.softserve.service;

import com.softserve.entity.Teacher;
import com.softserve.entity.TemporarySchedule;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TemporaryScheduleService extends BasicService<TemporarySchedule, Long> {
    List<TemporarySchedule> getAllByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId);
    List<TemporarySchedule> getTemporaryScheduleByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId);
    List<TemporarySchedule> getAllByCurrentSemester();
    List<TemporarySchedule> getAllBySemesterId(Long semesterId);
    List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate);
    List<TemporarySchedule> getAllBySemesterAndRange(Long semesterId, LocalDate fromDate, LocalDate toDate);
    List<TemporarySchedule> vacationByDateRange(LocalDate fromDate, LocalDate toDate);
    List<String> addRange(LocalDate from, LocalDate to, TemporarySchedule object);
    void deleteTemporarySchedulesBySemesterId(Long semesterId);
    public String getTeacherEmailFromTemporarySchedule(Teacher teacher);
    public Teacher getTeacherByScheduleId(Long scheduleId);
    Map<EvenOdd, Map<DayOfWeek, List<TemporarySchedule>>> getTemporaryScheduleForEvenOddWeeks(Long semesterId);
}

