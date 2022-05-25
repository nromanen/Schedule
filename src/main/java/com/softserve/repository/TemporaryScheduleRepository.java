package com.softserve.repository;

import com.softserve.entity.TemporarySchedule;

import java.time.LocalDate;
import java.util.List;

public interface TemporaryScheduleRepository extends BasicRepository<TemporarySchedule, Long> {
    Long isExistTemporaryScheduleByVacationByDate(LocalDate date, Long semesterId, boolean vacation);

    Long isExistTemporaryScheduleByVacationByDateWithIgnoreId(Long id, LocalDate date, Long semesterId, boolean vacation);

    Long isExistTemporaryScheduleByVacationByDateAndTeacher(LocalDate date, Long semesterId, Long teacherId, boolean vacation);

    Long isExistTemporaryScheduleByVacationByDateAndTeacherWithIgnoreId(Long id, LocalDate date, Long semesterId, Long teacherId, boolean vacation);

    Long isExistTemporarySchedule(TemporarySchedule object, boolean vacation);

    Long isExistTemporaryScheduleByDateAndScheduleId(TemporarySchedule object, boolean vacation);

    Long isExistTemporaryScheduleByDateAndScheduleIdWithIgnoreId(TemporarySchedule object, boolean vacation);

    Long isExistTemporaryScheduleWithIgnoreId(TemporarySchedule object);

    List<TemporarySchedule> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId);

    List<TemporarySchedule> getAllBySemesterAndRange(Long semesterId, LocalDate fromDate, LocalDate toDate);

    List<TemporarySchedule> getAllByTeacherAndRange(LocalDate fromDate, LocalDate toDate, Long teacherId);

    List<TemporarySchedule> getAllBySemester(Long semesterId);

    List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate);

    List<TemporarySchedule> vacationByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate);

    void deleteTemporarySchedulesBySemesterId(Long semesterId);
}
