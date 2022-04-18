package com.softserve.repository.impl;

import com.softserve.entity.Lesson;
import com.softserve.repository.LessonRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Repository
@Slf4j
public class LessonRepositoryImpl extends BasicRepositoryImpl<Lesson, Long> implements LessonRepository {

    private static final String SELECT_GROUPED
            = "select l from Lesson l "
            +"where l.grouped = true "
            + "and l.subject.id = :subjectId "
            + "and l.hours = :hours "
            + "and l.teacher.id = :teacherId "
            + "and l.semester.id = :semesterId "
            + "and l.lessonType = :lessonType "
            + "and l.subjectForSite = :subjectForSite";

    private static final String SET_GROUPED
            = "update Lesson "
            + "set grouped = true "
            + "where id = :id";

    private static final String UPDATE_GROUPED_TEACHER_OR_SUBJECT
            = "update Lesson "
            + "set subject.id = :subjectId, "
            + " hours = :hours, "
            + " teacher.id = :teacherId, "
            + " lessonType = :lessonType, "
            + " subjectForSite = :subjectForSite, "
            + " linkToMeeting = :linkToMeeting "
            + "where grouped = true "
            + "and subject.id = :initialSubjectId "
            + "and teacher.id = :initialTeacherId "
            + "and semester.id = :initialSemesterId";

    private static final String UPDATE_GROUPED
            = "update Lesson "
            + "set subject.id = :subjectId, "
            + " hours = :hours, "
            + " teacher.id = :teacherId, "
            + " lessonType = :lessonType, "
            + " subjectForSite = :subjectForSite, "
            + " linkToMeeting = :linkToMeeting "
            + "where grouped = true "
            + "and subject.id = :initialSubjectId "
            + "and hours = :initialHours "
            + "and teacher.id = :initialTeacherId "
            + "and semester.id = :initialSemesterId "
            + "and lessonType = :initialLessonType "
            + "and subjectForSite = :initialSubjectForSite";

    private static final String DELETE_GROUPED
            = "delete Lesson l "
            + "where l.grouped = true "
            + "and l.subject.id = :subjectId "
            + "and l.hours = :hours "
            + "and l.teacher.id = :teacherId "
            + "and l.semester.id = :semesterId "
            + "and l.lessonType = :lessonType "
            + "and l.subjectForSite = :subjectForSite";

    private static final String COUNT_QUERY
            = "select count (s.id) "
            + "from Schedule s "
            + "where s.lesson.id = :lessonId";

    private static final String GET_BY_SEMESTER_ID
            = "select l from Lesson l "
            + "where l.semester.id= :semesterId "
            + "order by l.subjectForSite ASC ";

    private static final String GET_SUBJECT_TEACHER_SEMESTER
            = "select l from Lesson l " +
            " where l.subject.id= :subjectId " +
            "and l.teacher.id= :teacherId " +
            "and l.semester.id= :semesterId " +
            "and l.lessonType= :lessonType " +
            "and l.id != :lessonId";

    private static final String DELETE_BY_SEMESTER_ID
            = "delete from Lesson l " +
            "where l.id " +
            "in (select les.id " +
            "from Lesson les " +
            "where les.semester.id = :semesterId)";

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

        cq.where(
                cb.equal(from.get("teacher").get("id"), lesson.getTeacher().getId()),
                cb.equal(from.get("subject").get("id"), lesson.getSubject().getId()),
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

    /**
     * The method used for getting list of lessons from database by semesterId
     *
     * @param semesterId Semester id for getting all lessons by this id from db
     * @return list of entities Lesson
     */
    @Override
    public List<Lesson> getLessonsBySemester(Long semesterId) {
        log.info("In getLessonsBySemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(GET_BY_SEMESTER_ID, Lesson.class)
                .setParameter("semesterId", semesterId)
                .getResultList();
    }

    @Override
    public void deleteLessonBySemesterId(Long semesterId) {
        log.info("In deleteLessonBySemesterId(semesterId = [{}])", semesterId);
        sessionFactory.getCurrentSession()
                .createQuery(DELETE_BY_SEMESTER_ID)
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
        return sessionFactory.getCurrentSession()
                .createQuery(GET_SUBJECT_TEACHER_SEMESTER, Lesson.class)
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
        return sessionFactory.getCurrentSession()
                .createQuery(SELECT_GROUPED, Lesson.class)
                .setParameter("subjectId", lesson.getSubject().getId())
                .setParameter("hours", lesson.getHours())
                .setParameter("teacherId", lesson.getTeacher().getId())
                .setParameter("semesterId", lesson.getSemester().getId())
                .setParameter("lessonType", lesson.getLessonType())
                .setParameter("subjectForSite", lesson.getSubjectForSite())
                .getResultList();
    }

    // Checking if lesson is used in Schedule table
    @Override
    protected boolean checkReference(Lesson lesson) {
        log.info("In checkReference(lesson = [{}])", lesson);
        Long count = sessionFactory.getCurrentSession().createQuery
                (COUNT_QUERY, Long.class)
                .setParameter("lessonId", lesson.getId())
                .getSingleResult();
        return count != 0;
    }

    /**
     * The method used for updating links to meeting for lessons.
     * By default, link to meeting is updated by semester id and teacher id
     * But update can be more specific by providing additional subject id and/or lesson type in a lesson object
     * @param lesson Lesson object with new link to meeting
     * @return Integer the number of links that was updated
     */
    @Override
    public Integer updateLinkToMeeting(Lesson lesson) {
        log.info("In repository updateLinkToMeeting lesson = [{}]", lesson);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaUpdate<Lesson> criteriaUpdate = cb.createCriteriaUpdate(Lesson.class);

        Root<Lesson> root = criteriaUpdate.from(Lesson.class);

        criteriaUpdate.set("linkToMeeting", lesson.getLinkToMeeting());

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("semester").get("id"), lesson.getSemester().getId()));
        predicates.add(cb.equal(root.get("teacher").get("id"), lesson.getTeacher().getId()));

        if (lesson.getSubject().getId() != null) {
            predicates.add(cb.equal(root.get("subject").get("id"), lesson.getSubject().getId()));
        }

        if (lesson.getLessonType() != null) {
            predicates.add(cb.equal(root.get("lessonType"), lesson.getLessonType()));
        }

        criteriaUpdate.where(predicates.toArray(new Predicate[0]));

        return sessionFactory.getCurrentSession().createQuery(criteriaUpdate).executeUpdate();
    }

    /**
     * Method is used to update grouped lessons
     * @param updatedLesson grouped lesson that needs to be updated
     * @return updated Lesson
     */
    @Override
    public Lesson updateGrouped(Lesson oldLesson,Lesson updatedLesson, boolean isTeacherOrSubjectUpdated) {
        log.info("Entered updateGroup({}, {})", oldLesson, updatedLesson);
        Session currentSession = sessionFactory.getCurrentSession();
        Query query = isTeacherOrSubjectUpdated
                ? currentSession.createQuery(UPDATE_GROUPED_TEACHER_OR_SUBJECT)
                : currentSession.createQuery(UPDATE_GROUPED);
        query = query.setParameter("initialSubjectId", oldLesson.getSubject().getId())
                .setParameter("initialTeacherId", oldLesson.getTeacher().getId())
                .setParameter("initialSemesterId", oldLesson.getSemester().getId())
                .setParameter("linkToMeeting", updatedLesson.getLinkToMeeting())
                .setParameter("subjectId", updatedLesson.getSubject().getId())
                .setParameter("hours", updatedLesson.getHours())
                .setParameter("teacherId", updatedLesson.getTeacher().getId())
                .setParameter("lessonType", updatedLesson.getLessonType())
                .setParameter("subjectForSite", updatedLesson.getSubjectForSite());
        query = isTeacherOrSubjectUpdated
                ? query
                : query.setParameter("initialSubjectForSite", oldLesson.getSubjectForSite())
                .setParameter("initialHours", oldLesson.getHours())
                .setParameter("initialLessonType", oldLesson.getLessonType());
        int updated = query.executeUpdate();
        log.debug("Updated group lessons {}", updated);
        return updatedLesson;
    }

    /**
     * The method is used to delete all lessons grouped
     *
     * @param lesson grouped lesson which must be deleted
     * @return deleted lesson
     */
    @Override
    public Lesson deleteGrouped(Lesson lesson) {
        log.info("Entered deleteGrouped({})", lesson);
        int deleted = sessionFactory.getCurrentSession()
                .createQuery(DELETE_GROUPED)
                .setParameter("subjectId", lesson.getSubject().getId())
                .setParameter("hours", lesson.getHours())
                .setParameter("teacherId", lesson.getTeacher().getId())
                .setParameter("semesterId", lesson.getSemester().getId())
                .setParameter("lessonType", lesson.getLessonType())
                .setParameter("subjectForSite", lesson.getSubjectForSite())
                .executeUpdate();
        log.debug("Deleted group lessons {}", deleted);
        return lesson;
    }

    @Override
    public int setGrouped(Long lessonId){
        log.info("Entered setGrouped({})", lessonId);
        return sessionFactory.getCurrentSession()
                .createQuery(SET_GROUPED)
                .setParameter("id", lessonId)
                .executeUpdate();
    }
}
