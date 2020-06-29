package com.softserve.repository;

import com.softserve.entity.*;
import java.time.LocalDate;
import java.util.List;

public interface TemporaryScheduleRepository extends BasicRepository<TemporarySchedule, Long> {
    Long isExistTemporaryScheduleByVacationByDate(LocalDate date, Long semesterId, boolean vacation);
    Long isExistTemporarySchedule(TemporarySchedule object);
    Long isExistTemporaryScheduleWithIgnoreId(TemporarySchedule object);
    List<TemporarySchedule> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);
    List<TemporarySchedule> getAllByTeacher(Long teacherId, Long semesterId);
    List<TemporarySchedule> getAllBySemester(Long semesterId);
    List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate);
    List<TemporarySchedule> vacationByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate);
}
