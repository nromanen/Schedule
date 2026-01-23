package com.softserve.repository.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class GroupRepositoryImpl extends BasicRepositoryImpl<Group, Long> implements GroupRepository {

    private static final String FROM_GROUP = " FROM StudentGroup g ";
    private static final String DISABLE_FILTER = " AND g.disable = false ";
    private static final String WHERE_DISABLE_FILTER = " WHERE g.disable = false ";

    private static final String GET_ALL_QUERY
            = "SELECT g"
            + FROM_GROUP
            + WHERE_DISABLE_FILTER
            + "ORDER BY g.title ASC";

    private static final String GET_WITH_STUDENTS_BY_ID_QUERY
            = "SELECT g"
            + FROM_GROUP
            + "LEFT JOIN FETCH g.students "
            + "WHERE g.id = :id"
            + DISABLE_FILTER;

    private static final String IS_EXISTS_BY_TITLE_QUERY
            = "SELECT CASE WHEN count(g.id) > 0 THEN true ELSE false END"
            + FROM_GROUP
            + "WHERE lower(g.title) = lower(:title)";

    private static final String IS_EXISTS_BY_TITLE_IGNORING_ID_QUERY
            = "SELECT CASE WHEN count(g.id) > 0 THEN true ELSE false END"
            + FROM_GROUP
            + "WHERE lower(g.title) = lower(:title) AND g.id <> :id";

    private static final String IS_EXISTS_BY_ID_QUERY
            = "SELECT CASE WHEN count(g.id) > 0 THEN true ELSE false END"
            + FROM_GROUP
            + "WHERE g.id = :id";

    private static final String IS_LESSONS_EXIST_FOR_GROUP_ID_QUERY
            = "SELECT CASE WHEN count(l.id) > 0 THEN true ELSE false END"
            + " FROM Lesson l "
            + "WHERE l.group.id = :groupId";

    private static final String GET_BY_TEACHER_ID
            = "SELECT DISTINCT l.group"
            + " FROM Lesson l "
            + "WHERE l.teacher.id = :id AND l.semester.defaultSemester = true"
            + " AND l.group.disable = false";

    private static final String GET_GROUPS_BY_IDS
            = "SELECT g"
            + FROM_GROUP
            + "WHERE g.id IN (:ids)"
            + DISABLE_FILTER;

    private static final String GET_ALL_ORDERED
            = "SELECT g"
            + FROM_GROUP
            + WHERE_DISABLE_FILTER
            + "ORDER BY g.sortOrder ASC";

    private static final String UPDATE_GROUP_OFFSET
            = "UPDATE StudentGroup g "
            + "SET g.sortOrder = g.sortOrder + 1 "
            + "WHERE g.sortOrder >= :lowerPosition AND g.sortOrder < :upperPosition";


    @Override
    public List<Group> getAll() {
        log.info("In getAll()");
        return getSession()
                .createQuery(GET_ALL_QUERY, Group.class)
                .getResultList();
    }

    @Override
    public List<Group> getByTeacherId(Long id) {
        log.info("In repository getByTeacherId(id = [{}])", id);
        return getSession()
                .createQuery(GET_BY_TEACHER_ID, Group.class)
                .setParameter("id", id)
                .getResultList();
    }

    @Override
    public List<Group> getAllBySortOrder() {
        log.debug("Entered getAllBySortOrder()");
        return getSession()
                .createQuery(GET_ALL_ORDERED, Group.class)
                .getResultList();
    }

    @Override
    public void changeGroupOrderOffset(Integer lowerBound, Integer upperBound) {
        log.info("Entered changeGroupOffset({}, {})", lowerBound, upperBound);
        int updated = getSession()
                .createMutationQuery(UPDATE_GROUP_OFFSET)
                .setParameter("lowerPosition", lowerBound)
                .setParameter("upperPosition", upperBound)
                .executeUpdate();
        log.debug("Updated order of {} groups", updated);
    }

    @Override
    public Optional<Group> getWithStudentsById(Long id) {
        log.info("In getWithStudentsById(id = [{}])", id);
        return getSession()
                .createQuery(GET_WITH_STUDENTS_BY_ID_QUERY, Group.class)
                .setParameter("id", id)
                .uniqueResultOptional();
    }

    @Override
    public boolean isExistsByTitle(String title) {
        log.info("In isExistsByTitle(title = [{}])", title);
        if (title == null) {
            return false;
        }
        return getSession()
                .createQuery(IS_EXISTS_BY_TITLE_QUERY, Boolean.class)
                .setParameter("title", title)
                .getSingleResult();
    }

    @Override
    public boolean isExistsByTitleIgnoringId(String title, Long id) {
        log.info("In isExistsByTitleIgnoringId(id = [{}], title = [{}])", id, title);
        if (title == null) {
            return false;
        }
        return getSession()
                .createQuery(IS_EXISTS_BY_TITLE_IGNORING_ID_QUERY, Boolean.class)
                .setParameter("title", title)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public boolean isExistsById(Long id) {
        log.info("In isExistsById(id = [{}])", id);
        return getSession()
                .createQuery(IS_EXISTS_BY_ID_QUERY, Boolean.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    protected boolean checkReference(Group group) {
        log.info("In checkReference(group = [{}])", group);
        return getSession()
                .createQuery(IS_LESSONS_EXIST_FOR_GROUP_ID_QUERY, Boolean.class)
                .setParameter("groupId", group.getId())
                .getSingleResult();
    }

    @Override
    public List<Group> getGroupsByGroupIds(List<Long> groupIds) {
        return getSession()
                .createQuery(GET_GROUPS_BY_IDS, Group.class)
                .setParameterList("ids", groupIds)
                .getResultList();
    }
}
