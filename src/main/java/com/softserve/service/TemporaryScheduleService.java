package com.softserve.service;


import com.softserve.entity.TemporarySchedule;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TemporaryScheduleService extends BasicService<TemporarySchedule, Long> {
    List<TemporarySchedule> getAllByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId);
    List<TemporarySchedule> getAllBySemester();
    List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate);
    List<TemporarySchedule> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);
    List<TemporarySchedule> vacationByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate);
    List<String>  addRange(LocalDate from, LocalDate to, TemporarySchedule object);
}

