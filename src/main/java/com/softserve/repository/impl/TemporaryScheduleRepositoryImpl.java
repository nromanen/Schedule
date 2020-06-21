package com.softserve.repository.impl;

import com.softserve.dto.TemporaryScheduleSaveDTO;
import com.softserve.entity.*;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.ScheduleRepository;
import com.softserve.repository.TemporaryScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class TemporaryScheduleRepositoryImpl extends BasicRepositoryImpl<TemporarySchedule, Long> implements TemporaryScheduleRepository {


    /**
     * Method counts schedule records in db for group in the semester
     *
     * @param date
     * @return number of records in db
     */
    @Override
    public Long isExistVacationByDate(LocalDate date, Long semesterId) {
        log.info("In isExistVacationByDate(semesterId = [{}], date = [{}])", semesterId, date);
        return (Long) sessionFactory.getCurrentSession().createQuery("select count (s.id) from  TemporarySchedule s where  s.date = :date and s.vacation =  true and s.semester.id = :semesterId ")
                .setParameter("date", date)
                .setParameter("semesterId", semesterId)
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
                "and s.room.id=:roomId and s.group.id=:groupId and s.period.id = :periodId and s.subject.id = :subjectId and s.lessonId = :lessonId and s.lessonType=:lessonType and s.semester.id = :semesterId")
                .setParameter("date", object.getDate())
                .setParameter("roomId", object.getRoom().getId())
                .setParameter("groupId", object.getGroup().getId())
                .setParameter("periodId", object.getPeriod().getId())
                .setParameter("subjectId", object.getSubject().getId())
                .setParameter("lessonId", object.getLessonId())
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
                "and s.room.id=:roomId and s.group.id=:groupId and s.period.id = :periodId and s.subject.id = :subjectId and s.lessonId = :lessonId and s.lessonType=:lessonType and s.semester.id = :semesterId and s.id!=:id")
                .setParameter("date", object.getDate())
                .setParameter("roomId", object.getRoom().getId())
                .setParameter("groupId", object.getGroup().getId())
                .setParameter("periodId", object.getPeriod().getId())
                .setParameter("subjectId", object.getSubject().getId())
                .setParameter("lessonId", object.getLessonId())
                .setParameter("lessonType", object.getLessonType())
                .setParameter("semesterId", object.getSemester().getId())
                .setParameter("id", object.getId())
                .getSingleResult();
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
        return  sessionFactory.getCurrentSession().createQuery("select t from  TemporarySchedule t  " +
                "join Lesson l on t.lessonId=l.id " +
                "where  (t.teacher.id = :teacherId  or l.teacher.id = :teacherId) and t.semester.id = :semesterId ")
                .setParameter("teacherId", teacherId)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }

}
