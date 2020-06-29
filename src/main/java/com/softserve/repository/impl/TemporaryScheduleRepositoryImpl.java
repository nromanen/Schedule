package com.softserve.repository.impl;

import com.softserve.entity.*;
import com.softserve.repository.TemporaryScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
@Slf4j
public class TemporaryScheduleRepositoryImpl extends BasicRepositoryImpl<TemporarySchedule, Long> implements TemporaryScheduleRepository {


    /**
     * Method counts temporary schedule records in db for date and vacation  in the semester
     *
     * @param date, semesterId, vacation
     * @return number of records in db
     */
    @Override
    public Long isExistTemporaryScheduleByVacationByDate(LocalDate date, Long semesterId, boolean vacation) {
        log.info("In isExistVacationByDate(semesterId = [{}], date = [{}])", semesterId, date);
        return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) from  TemporarySchedule s where  s.date = :date and s.vacation =  :vacation and s.semester.id = :semesterId ")
                .setParameter("date", date)
                .setParameter("semesterId", semesterId)
                .setParameter("vacation", vacation)
                .getSingleResult();
    }

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param object
     * @return number of records in db
     */
    @Override
    public Long isExistTemporarySchedule(TemporarySchedule object) {
        log.info("In isExistTemporarySchedule(object = [{}]", object);
        return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) from  TemporarySchedule s where  s.date = :date and s.vacation =  false " +
                "and s.room.id=:roomId and s.group.id=:groupId and s.period.id = :periodId and s.subject.id = :subjectId and s.scheduleId = :scheduleId and s.lessonType=:lessonType and s.semester.id = :semesterId")
                .setParameter("date", object.getDate())
                .setParameter("roomId", object.getRoom().getId())
                .setParameter("groupId", object.getGroup().getId())
                .setParameter("periodId", object.getPeriod().getId())
                .setParameter("subjectId", object.getSubject().getId())
                .setParameter("scheduleId", object.getScheduleId())
                .setParameter("lessonType", object.getLessonType())
                .setParameter("semesterId", object.getSemester().getId())
                .getSingleResult();
    }

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param object
     * @return number of records in db
     */
    @Override
    public Long isExistTemporaryScheduleWithIgnoreId(TemporarySchedule object) {
        log.info("In isExistTemporarySchedule(object = [{}]", object);
        return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) from  TemporarySchedule s where  s.date = :date and s.vacation =  false " +
                "and s.room.id=:roomId and s.group.id=:groupId and s.period.id = :periodId and s.subject.id = :subjectId and s.scheduleId = :scheduleId and s.lessonType=:lessonType and s.semester.id = :semesterId and s.id!=:id")
                .setParameter("date", object.getDate())
                .setParameter("roomId", object.getRoom().getId())
                .setParameter("groupId", object.getGroup().getId())
                .setParameter("periodId", object.getPeriod().getId())
                .setParameter("subjectId", object.getSubject().getId())
                .setParameter("scheduleId", object.getScheduleId())
                .setParameter("lessonType", object.getLessonType())
                .setParameter("semesterId", object.getSemester().getId())
                .setParameter("id", object.getId())
                .getSingleResult();
    }


    /**
     * Method scheduleByDateRangeForTeacher get all schedules from db in particular date range
     * @param fromDate LocalDate from
     * @param toDate LocalDate to
     * @param teacherId id teacher
     * @return list of schedules
     */
    @Override
    public List<TemporarySchedule> temporaryScheduleByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate, Long teacherId) {
        log.info("In scheduleByDateRangeForTeacher with fromDate = {} and toDate = {}", fromDate, toDate);
        return sessionFactory.getCurrentSession().createQuery("SELECT t from TemporarySchedule t " +
                " join Schedule  s on t.scheduleId = s.id" +
                " join Lesson l on s.lesson.id  = l.id " +
                "where t.date <= :toDate  and t.date >= :fromDate and ( t.teacher.id = :teacherId or l.teacher.id = :teacherId ) and t.vacation=false ")
                .setParameter("fromDate", fromDate)
                .setParameter("toDate", toDate)
                .setParameter("teacherId", teacherId)
                .getResultList();
    }

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param teacherId, semesterId
     * @return number of records in db
     */
    @Override
    public List<TemporarySchedule> getAllByTeacher(Long teacherId, Long semesterId) {
        log.info("In getAllByTeacher(teacherId = [{}], semesterId = [{}]", teacherId, semesterId);
        return sessionFactory.getCurrentSession().createQuery("SELECT t from TemporarySchedule t " +
                " join Schedule  s on t.scheduleId = s.id" +
                " join Lesson l on s.lesson.id  = l.id " +
                "where ( t.teacher.id = :teacherId or l.teacher.id = :teacherId ) and t.semester.id = :semesterId")
                .setParameter("teacherId", teacherId)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }


    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param semesterId
     * @return number of records in db
     */
    @Override
    public List<TemporarySchedule> getAllBySemester(Long semesterId) {
        log.info("In getAllBySemester(semesterId = [{}]", semesterId);
        return sessionFactory.getCurrentSession().createQuery("SELECT t from TemporarySchedule t " +
                " join Schedule  s on t.scheduleId = s.id" +
                " join Lesson l on s.lesson.id  = l.id " +
                "where t.semester.id = :semesterId")
                .setParameter("semesterId", semesterId)
                .getResultList();
    }

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param semesterId
     * @return number of records in db
     */
    @Override
    public List<TemporarySchedule> getAllByRange(LocalDate fromDate, LocalDate toDate, Long semesterId) {
        log.info("In getAllByRange(semesterId = [{}]", semesterId);
        return sessionFactory.getCurrentSession().createQuery("SELECT t from TemporarySchedule t " +
                " join Schedule  s on t.scheduleId = s.id" +
                " join Lesson l on s.lesson.id  = l.id " +
                "where t.date <= :toDate  and t.date >= :fromDate and t.semester.id = :semesterId")
                .setParameter("fromDate", fromDate)
                .setParameter("toDate", toDate)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }

    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param fromDate, toDate, teacherId, semesterId
     * @return number of records in db
     */
    @Override
    public List<TemporarySchedule> vacationByDateRangeForTeacher(LocalDate fromDate, LocalDate toDate,  Long semesterId) {
        log.info("In vacationByDateRangeForTeacher(semesterId = [{}]", semesterId);
        return sessionFactory.getCurrentSession().createQuery("SELECT t from TemporarySchedule t " +
                "where t.date <= :toDate  and t.date >= :fromDate and t.semester.id = :semesterId and t.vacation = true ")
                .setParameter("fromDate", fromDate)
                .setParameter("toDate", toDate)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }
}
