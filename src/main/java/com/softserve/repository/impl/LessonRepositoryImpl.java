package com.softserve.repository.impl;

import com.softserve.entity.Lesson;
import com.softserve.repository.LessonRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.List;

@Repository
@Slf4j
public class LessonRepositoryImpl extends BasicRepositoryImpl<Lesson, Long> implements LessonRepository {

    private static final String SELECT_GROUPED = "select l from Lesson l " +
            "where l.grouped=true and l.subject.id= :subjectId " +
            "and l.hours= :hours and l.teacher.id= :teacherId " +
            "and l.semester.id= :semesterId and l.lessonType= :lessonType";

    /**
     * Method gets information about all lessons from DB
     *
     * @return List of all lessons
     */
    @Override
    public List<Lesson> getAll() {
        log.info("In getAll()");
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);
        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("subject").get("disable"), false),
                cb.equal(from.get("group").get("disable"), false));
        cq.orderBy(cb.asc(from.get("subjectForSite")));

        TypedQuery<Lesson> tq = sessionFactory.getCurrentSession().createQuery(cq);
        return tq.getResultList();
    }


    /**
     * Method gets information about all lessons for particular group from DB
     *
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getAllForGroup(Long groupId, Long semesterId) {
        log.info("In getAllForGroup(groupId = [{}])", groupId);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("subject").get("disable"), false),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("group").get("id"), groupId),
                cb.equal(from.get("semester").get("id"), semesterId));
        cq.orderBy(cb.asc(from.get("subjectForSite")));
        TypedQuery<Lesson> tq = sessionFactory.getCurrentSession().createQuery(cq);
        return  tq.getResultList();
    }


    /**
     * Method gets information  all lessons for teacher from DB
     *
     * @param teacherId Identity number of the teacher for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getLessonByTeacher(Long teacherId, Long semesterId) {
        log.info("In getLessonByTeacher(groupId = [{}])", teacherId);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("teacher").get("id"), teacherId),
                cb.equal(from.get("subject").get("disable"), false),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("semester").get("id"), semesterId));
        cq.orderBy(cb.asc(from.get("subjectForSite")));
        TypedQuery<Lesson> tq = sessionFactory.getCurrentSession().createQuery(cq);
        return  tq.getResultList();
    }



    /**
     * Method searches duplicate of lesson in the DB
     *
     * @param lesson Lesson entity that needs to be verified
     * @return count of duplicates if such exist, else return 0
     */
    @Override
    public Long countLessonDuplicates(Lesson lesson) {
        log.info("In countLessonDuplicates(lesson = [{}])", lesson);

        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("teacher").get("id"), lesson.getTeacher().getId()),

                cb.equal(from.get("subject").get("disable"), false),
                cb.equal(from.get("subject").get("id"), lesson.getSubject().getId()),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("group").get("id"), lesson.getGroup().getId()),

                cb.equal(from.get("semester").get("id"), lesson.getSemester().getId()),
                cb.equal(from.get("lessonType"),lesson.getLessonType()));
        cq.select(cb.count(from));
        Query<Long> query = sessionFactory.getCurrentSession().createQuery(cq);
        return query.getSingleResult();
    }

    /**
     * Method searches duplicate of lesson in the DB
     *
     * @param lesson Lesson entity that needs to be verified
     * @return count of duplicates if such exist, else return 0
     */
    @Override
    public Long countLessonDuplicatesWithIgnoreId(Lesson lesson) {
        log.info("In countLessonDuplicates(lesson = [{}])", lesson);

        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("teacher").get("id"), lesson.getTeacher().getId()),

                cb.equal(from.get("subject").get("disable"), false),
                cb.equal(from.get("subject").get("id"), lesson.getSubject().getId()),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("group").get("id"), lesson.getGroup().getId()),

                cb.notEqual(from.get("id"), lesson.getId()),
                cb.equal(from.get("semester").get("id"), lesson.getSemester().getId()),
                cb.equal(from.get("lessonType"), lesson.getLessonType()));
        cq.select(cb.count(from));
        Query<Long> query = sessionFactory.getCurrentSession().createQuery(cq);
        return query.getSingleResult();
    }

    /*
     * The method used for getting list of lessons from database by semesterId
     *
     * @param semesterId Semester id for getting all lessons by this id from db
     * @return list of entities Lesson
     */
    @Override
    public List<Lesson> getLessonsBySemester(Long semesterId) {
        log.info("In getLessonsBySemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession().createQuery(
                "select l from Lesson l " +
                        " where l.semester.id= :semesterId order by subjectForSite ASC ").setParameter("semesterId", semesterId)
                .getResultList();
    }

    @Override
    public void deleteLessonBySemesterId(Long semesterId) {
        log.info("In deleteLessonBySemesterId(semesterId = [{}])", semesterId);
        sessionFactory.getCurrentSession().createQuery(
                "delete from Lesson l where l.id in (select les.id from Lesson les where les.semester.id = :semesterId)")
                .setParameter("semesterId", semesterId).executeUpdate();
    }

    /**
     * The method used for getting all lessons from database by subjectForSite, teacherForSite and semesterId
     *
     * @param lesson Lesson object for getting lessons from db by this param
     * @return List of Lessons
     */
    @Override
    public List<Lesson> getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(Lesson lesson) {
        log.info("In getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(lesson = [{}]", lesson);
        return sessionFactory.getCurrentSession().createQuery(
                "select l from Lesson l " +
                        " where l.subject.id= :subjectId and l.teacher.id= :teacherId and l.semester.id= :semesterId and l.lessonType= :lessonType and l.id != :lessonId")
                .setParameter("subjectId", lesson.getSubject().getId())
                .setParameter("teacherId", lesson.getTeacher().getId())
                .setParameter("semesterId", lesson.getSemester().getId())
                .setParameter("lessonType", lesson.getLessonType())
                .setParameter("lessonId", lesson.getId())
                .getResultList();
    }

    /**
     * The method used for getting all lessons from database which are grouped by lesson
     *
     * @param lesson Lesson object for getting lessons
     * @return List of Lessons
     */
    @Override
    public List<Lesson> getGroupedLessonsByLesson(Lesson lesson) {
        log.info("getGroupedLessonsByLessonId(lesson = [{}]", lesson);
        return sessionFactory.getCurrentSession().createQuery(SELECT_GROUPED)
                .setParameter("subjectId", lesson.getSubject().getId())
                .setParameter("hours", lesson.getHours())
                .setParameter("teacherId", lesson.getTeacher().getId())
                .setParameter("semesterId", lesson.getSemester().getId())
                .setParameter("lessonType", lesson.getLessonType())
                .getResultList();
    }

    // Checking if lesson is used in Schedule table
    @Override
    protected boolean checkReference(Lesson lesson) {
        log.info("In checkReference(lesson = [{}])", lesson);
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (s.id) " +
                        "from Schedule s where s.lesson.id = :lessonId")
                .setParameter("lessonId", lesson.getId())
                .getSingleResult();
        return count != 0;
    }

    /**
     * The method used for updating links to meeting for lessons
     * @param lesson Lesson object with new link to meeting
     */
    @Override
    public void updateLinkToMeeting(Lesson lesson) {
        log.info("In repository updateLinkToMeeting lesson = [{}]", lesson);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaUpdate<Lesson> criteriaUpdate = cb.createCriteriaUpdate(Lesson.class);

        Root<Lesson> root = criteriaUpdate.from(Lesson.class);

        criteriaUpdate.set("linkToMeeting", lesson.getLinkToMeeting());

        criteriaUpdate.where(cb.equal(root.get("semester").get("id"), lesson.getSemester().getId()),
                cb.equal(root.get("teacher").get("id"), lesson.getTeacher().getId()));

        if (lesson.getSubject().getId() != null) {
            criteriaUpdate.where(cb.equal(root.get("subject").get("id"), lesson.getSubject().getId()));
        }

        if (lesson.getLessonType() != null) {
            criteriaUpdate.where(cb.equal(root.get("lessonType"), lesson.getLessonType()));
        }

        sessionFactory.getCurrentSession().createQuery(criteriaUpdate).executeUpdate();
    }
}
