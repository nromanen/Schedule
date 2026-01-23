package com.softserve.repository.impl;

import com.softserve.entity.Lesson;
import com.softserve.entity.Semester;
import com.softserve.repository.LessonRepository;
import com.softserve.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import jakarta.persistence.criteria.*;  // 1. javax → jakarta
import java.util.ArrayList;
import java.util.List;

@Repository
@Slf4j
public class LessonRepositoryImpl extends BasicRepositoryImpl<Lesson, Long> implements LessonRepository {

    private static final String SELECT_GROUPED
            = "SELECT l FROM Lesson l "
            + "WHERE l.grouped = true "
            + "AND l.subject.id = :subjectId "
            + "AND l.hours = :hours "
            + "AND l.teacher.id = :teacherId "
            + "AND l.semester.id = :semesterId "
            + "AND l.lessonType = :lessonType "
            + "AND l.subjectForSite = :subjectForSite";

    private static final String SET_GROUPED
            = "UPDATE Lesson "
            + "SET grouped = true "
            + "WHERE id = :id";

    private static final String UPDATE_GROUPED_TEACHER_OR_SUBJECT
            = "UPDATE Lesson "
            + "SET subject.id = :subjectId, "
            + "hours = :hours, "
            + "teacher.id = :teacherId, "
            + "lessonType = :lessonType, "
            + "subjectForSite = :subjectForSite, "
            + "linkToMeeting = :linkToMeeting "
            + "WHERE grouped = true "
            + "AND subject.id = :initialSubjectId "
            + "AND teacher.id = :initialTeacherId "
            + "AND semester.id = :initialSemesterId";

    private static final String UPDATE_GROUPED
            = "UPDATE Lesson "
            + "SET subject.id = :subjectId, "
            + "hours = :hours, "
            + "teacher.id = :teacherId, "
            + "lessonType = :lessonType, "
            + "subjectForSite = :subjectForSite, "
            + "linkToMeeting = :linkToMeeting "
            + "WHERE grouped = true "
            + "AND subject.id = :initialSubjectId "
            + "AND hours = :initialHours "
            + "AND teacher.id = :initialTeacherId "
            + "AND semester.id = :initialSemesterId "
            + "AND lessonType = :initialLessonType "
            + "AND subjectForSite = :initialSubjectForSite";

    private static final String DELETE_GROUPED
            = "DELETE FROM Lesson l "
            + "WHERE l.grouped = true "
            + "AND l.subject.id = :subjectId "
            + "AND l.hours = :hours "
            + "AND l.teacher.id = :teacherId "
            + "AND l.semester.id = :semesterId "
            + "AND l.lessonType = :lessonType "
            + "AND l.subjectForSite = :subjectForSite";

    private static final String COUNT_QUERY
            = "SELECT count(s.id) "
            + "FROM Schedule s "
            + "WHERE s.lesson.id = :lessonId";

    private static final String GET_BY_SEMESTER_ID =
            "SELECT DISTINCT l FROM Lesson l " +
                    "JOIN FETCH l.semester s " +
                    "LEFT JOIN FETCH s.periods " +
                    "LEFT JOIN FETCH s.groups " +
                    "WHERE l.semester.id = :semesterId " +
                    "ORDER BY l.subjectForSite ASC";

    private static final String GET_SUBJECT_TEACHER_SEMESTER =
            "SELECT DISTINCT l FROM Lesson l " +
                    "JOIN FETCH l.semester s " +
                    "LEFT JOIN FETCH s.periods " +
                    "LEFT JOIN FETCH s.groups " +
                    "WHERE l.subject.id = :subjectId " +
                    "AND l.teacher.id = :teacherId " +
                    "AND l.semester.id = :semesterId " +
                    "AND l.lessonType = :lessonType " +
                    "AND l.id <> :lessonId";

    private static final String DELETE_BY_SEMESTER_ID
            = "DELETE FROM Lesson l " +
            "WHERE l.id " +
            "IN (SELECT les.id " +
            "FROM Lesson les " +
            "WHERE les.semester.id = :semesterId)";

    @Override
    public List<Lesson> getAll() {
        log.info("In getAll()");
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        CriteriaQuery<Lesson> cq1 = cb.createQuery(Lesson.class);
        Root<Lesson> from1 = cq1.from(Lesson.class);
        Fetch<Lesson, Semester> semesterFetch = from1.fetch(Constants.SEMESTER, JoinType.LEFT);
        semesterFetch.fetch("periods", JoinType.LEFT);

        cq1.where(
                cb.equal(from1.get(Constants.TEACHER).get(Constants.DISABLE), false),
                cb.equal(from1.get(Constants.SUBJECT).get(Constants.DISABLE), false),
                cb.equal(from1.get(Constants.GROUP).get(Constants.DISABLE), false)
        );
        cq1.orderBy(cb.asc(from1.get(Constants.SUBJECT_FOR_SITE)));
        cq1.distinct(true);

        List<Lesson> lessons = session.createQuery(cq1).getResultList();

        lessons.stream()
                .map(Lesson::getSemester)
                .distinct()
                .forEach(s -> Hibernate.initialize(s.getGroups()));

        return lessons;
    }

    @Override
    public List<Lesson> getAllForGroup(Long groupId, Long semesterId) {
        log.info("In getAllForGroup(groupId = [{}])", groupId);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);

        Fetch<Lesson, Semester> semesterFetch = from.fetch(Constants.SEMESTER, JoinType.LEFT);
        semesterFetch.fetch("periods", JoinType.LEFT);
        semesterFetch.fetch("groups", JoinType.LEFT);

        cq.where(
                cb.equal(from.get(Constants.TEACHER).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.SUBJECT).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.GROUP).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.GROUP).get(Constants.ID), groupId),
                cb.equal(from.get(Constants.SEMESTER).get(Constants.ID), semesterId)
        );

        cq.orderBy(cb.asc(from.get(Constants.SUBJECT_FOR_SITE)));
        cq.distinct(true);

        return sessionFactory.getCurrentSession().createQuery(cq).getResultList();
    }

    @Override
    public List<Lesson> getLessonByTeacher(Long teacherId, Long semesterId) {
        log.info("In getLessonByTeacher(teacherId = [{}])", teacherId);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);

        Fetch<Lesson, Semester> semesterFetch = from.fetch(Constants.SEMESTER, JoinType.LEFT);
        semesterFetch.fetch("periods", JoinType.LEFT);
        semesterFetch.fetch("groups", JoinType.LEFT);

        cq.where(
                cb.equal(from.get(Constants.TEACHER).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.TEACHER).get(Constants.ID), teacherId),
                cb.equal(from.get(Constants.SUBJECT).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.GROUP).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.SEMESTER).get(Constants.ID), semesterId)
        );

        cq.orderBy(cb.asc(from.get(Constants.SUBJECT_FOR_SITE)));
        cq.distinct(true);

        return sessionFactory.getCurrentSession().createQuery(cq).getResultList();
    }

    @Override
    public Long countLessonDuplicates(Lesson lesson) {
        log.info("In countLessonDuplicates(lesson = [{}])", lesson);

        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(
                cb.equal(from.get(Constants.TEACHER).get(Constants.ID), lesson.getTeacher().getId()),
                cb.equal(from.get(Constants.SUBJECT).get(Constants.ID), lesson.getSubject().getId()),
                cb.equal(from.get(Constants.GROUP).get(Constants.ID), lesson.getGroup().getId()),
                cb.equal(from.get(Constants.SEMESTER).get(Constants.ID), lesson.getSemester().getId()),
                cb.equal(from.get(Constants.LESSON_TYPE), lesson.getLessonType()));

        cq.select(cb.count(from));
        Query<Long> query = sessionFactory.getCurrentSession().createQuery(cq);
        return query.getSingleResult();
    }

    @Override
    public Long countLessonDuplicatesWithIgnoreId(Lesson lesson) {
        log.info("In countLessonDuplicates(lesson = [{}])", lesson);

        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get(Constants.TEACHER).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.TEACHER).get(Constants.ID), lesson.getTeacher().getId()),

                cb.equal(from.get(Constants.SUBJECT).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.SUBJECT).get(Constants.ID), lesson.getSubject().getId()),

                cb.equal(from.get(Constants.GROUP).get(Constants.DISABLE), false),
                cb.equal(from.get(Constants.GROUP).get(Constants.ID), lesson.getGroup().getId()),

                cb.notEqual(from.get(Constants.ID), lesson.getId()),
                cb.equal(from.get(Constants.SEMESTER).get(Constants.ID), lesson.getSemester().getId()),
                cb.equal(from.get(Constants.LESSON_TYPE), lesson.getLessonType()));
        cq.select(cb.count(from));
        Query<Long> query = sessionFactory.getCurrentSession().createQuery(cq);
        return query.getSingleResult();
    }

    @Override
    public List<Lesson> getLessonsBySemester(Long semesterId) {
        log.info("In getLessonsBySemester(semesterId = [{}])", semesterId);
        return sessionFactory.getCurrentSession()
                .createQuery(GET_BY_SEMESTER_ID, Lesson.class)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .getResultList();
    }

    @Override
    public void deleteLessonsBySemesterId(Long semesterId) {
        log.info("In deleteLessonBySemesterId(semesterId = [{}])", semesterId);
        sessionFactory.getCurrentSession()
                .createMutationQuery(DELETE_BY_SEMESTER_ID)
                .setParameter(Constants.SEMESTER_ID, semesterId)
                .executeUpdate();
    }

    @Override
    public List<Lesson> getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(Lesson lesson) {
        log.info("In getLessonsBySubjectIdTeacherIdSemesterIdLessonTypeAndExcludeCurrentLessonId(lesson = [{}]", lesson);
        return sessionFactory.getCurrentSession()
                .createQuery(GET_SUBJECT_TEACHER_SEMESTER, Lesson.class)
                .setParameter(Constants.SUBJECT_ID, lesson.getSubject().getId())
                .setParameter(Constants.TEACHER_ID, lesson.getTeacher().getId())
                .setParameter(Constants.SEMESTER_ID, lesson.getSemester().getId())
                .setParameter(Constants.LESSON_TYPE, lesson.getLessonType())
                .setParameter(Constants.LESSON_ID, lesson.getId())
                .getResultList();
    }

    @Override
    public List<Lesson> getGroupedLessonsByLesson(Lesson lesson) {
        log.info("getGroupedLessonsByLessonId(lesson = [{}]", lesson);
        return sessionFactory.getCurrentSession()
                .createQuery(SELECT_GROUPED, Lesson.class)
                .setParameter(Constants.SUBJECT_ID, lesson.getSubject().getId())
                .setParameter(Constants.HOURS, lesson.getHours())
                .setParameter(Constants.TEACHER_ID, lesson.getTeacher().getId())
                .setParameter(Constants.SEMESTER_ID, lesson.getSemester().getId())
                .setParameter(Constants.LESSON_TYPE, lesson.getLessonType())
                .setParameter(Constants.SUBJECT_FOR_SITE, lesson.getSubjectForSite())
                .getResultList();
    }

    @Override
    protected boolean checkReference(Lesson lesson) {
        log.info("In checkReference(lesson = [{}])", lesson);
        Long count = sessionFactory.getCurrentSession().createQuery(COUNT_QUERY, Long.class)
                .setParameter(Constants.LESSON_ID, lesson.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public Integer updateLinkToMeeting(Lesson lesson) {
        log.info("In repository updateLinkToMeeting lesson = [{}]", lesson);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaUpdate<Lesson> criteriaUpdate = cb.createCriteriaUpdate(Lesson.class);

        Root<Lesson> root = criteriaUpdate.from(Lesson.class);

        criteriaUpdate.set("linkToMeeting", lesson.getLinkToMeeting());

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get(Constants.SEMESTER).get(Constants.ID), lesson.getSemester().getId()));
        predicates.add(cb.equal(root.get(Constants.TEACHER).get(Constants.ID), lesson.getTeacher().getId()));

        if (lesson.getSubject().getId() != null) {
            predicates.add(cb.equal(root.get(Constants.SUBJECT).get(Constants.ID), lesson.getSubject().getId()));
        }

        if (lesson.getLessonType() != null) {
            predicates.add(cb.equal(root.get(Constants.LESSON_TYPE), lesson.getLessonType()));
        }

        criteriaUpdate.where(predicates.toArray(new Predicate[0]));

        return sessionFactory.getCurrentSession().createMutationQuery(criteriaUpdate).executeUpdate();
    }

    @Override
    public Lesson updateGrouped(Lesson oldLesson, Lesson updatedLesson, boolean isTeacherOrSubjectUpdated) {
        log.info("Entered updateGroup({}, {})", oldLesson, updatedLesson);
        Session currentSession = sessionFactory.getCurrentSession();

        var query = currentSession.createMutationQuery(
                isTeacherOrSubjectUpdated ? UPDATE_GROUPED_TEACHER_OR_SUBJECT : UPDATE_GROUPED
        );

        query.setParameter("initialSubjectId", oldLesson.getSubject().getId())
                .setParameter("initialTeacherId", oldLesson.getTeacher().getId())
                .setParameter("initialSemesterId", oldLesson.getSemester().getId())
                .setParameter("linkToMeeting", updatedLesson.getLinkToMeeting())
                .setParameter(Constants.SUBJECT_ID, updatedLesson.getSubject().getId())
                .setParameter(Constants.HOURS, updatedLesson.getHours())
                .setParameter(Constants.TEACHER_ID, updatedLesson.getTeacher().getId())
                .setParameter(Constants.LESSON_TYPE, updatedLesson.getLessonType())
                .setParameter(Constants.SUBJECT_FOR_SITE, updatedLesson.getSubjectForSite());

        if (!isTeacherOrSubjectUpdated) {
            query.setParameter("initialSubjectForSite", oldLesson.getSubjectForSite())
                    .setParameter("initialHours", oldLesson.getHours())
                    .setParameter("initialLessonType", oldLesson.getLessonType());
        }

        int updated = query.executeUpdate();
        log.debug("Updated group lessons {}", updated);
        return updatedLesson;
    }

    @Override
    public Lesson deleteGrouped(Lesson lesson) {
        log.info("Entered deleteGrouped({})", lesson);
        int deleted = sessionFactory.getCurrentSession()
                .createMutationQuery(DELETE_GROUPED)
                .setParameter(Constants.SUBJECT_ID, lesson.getSubject().getId())
                .setParameter(Constants.HOURS, lesson.getHours())
                .setParameter(Constants.TEACHER_ID, lesson.getTeacher().getId())
                .setParameter(Constants.SEMESTER_ID, lesson.getSemester().getId())
                .setParameter(Constants.LESSON_TYPE, lesson.getLessonType())
                .setParameter(Constants.SUBJECT_FOR_SITE, lesson.getSubjectForSite())
                .executeUpdate();
        log.debug("Deleted group lessons {}", deleted);
        return lesson;
    }

    @Override
    public int setGrouped(Long lessonId) {
        log.info("Entered setGrouped({})", lessonId);
        return sessionFactory.getCurrentSession()
                .createMutationQuery(SET_GROUPED)
                .setParameter(Constants.ID, lessonId)
                .executeUpdate();
    }
}
