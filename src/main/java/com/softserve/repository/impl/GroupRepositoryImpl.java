package com.softserve.repository.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class GroupRepositoryImpl extends BasicRepositoryImpl<Group, Long> implements GroupRepository {
    private static final String GET_ALL_QUERY
            = "SELECT g "
            + "FROM Group g "
            + "ORDER BY g.title ASC";

    private static final String GET_WITH_STUDENTS_BY_ID_QUERY
            = "SELECT g "
            + "FROM Group g "
            + "LEFT JOIN FETCH g.students "
            + "WHERE g.id = :id";

    private static final String IS_EXISTS_BY_TITLE_QUERY
            = "SELECT (count(*) > 0) "
            + "FROM Group g "
            + "WHERE lower(g.title) = lower(:title)";

    private static final String IS_EXISTS_BY_TITLE_IGNORING_ID_QUERY = IS_EXISTS_BY_TITLE_QUERY + " AND g.id!=:id";

    private static final String IS_EXISTS_BY_ID_QUERY
            = "SELECT (count(*) > 0) "
            + "FROM Group g "
            + "WHERE g.id = :id";

    private static final String IS_LESSONS_EXIST_FOR_GROUP_ID_QUERY
            = "SELECT (count(l.id) > 0) "
            + "FROM Lesson l "
            + "WHERE l.group.id = :groupId";

    private static final String GET_BY_TEACHER_ID
            = "SELECT DISTINCT l.group "
            + "FROM Lesson l "
            + "WHERE l.teacher.id = :id AND l.semester.defaultSemester = true";

    private Session getSession(){
        Session session = sessionFactory.getCurrentSession();
        Filter filter = session.enableFilter("groupDisableFilter");
        filter.setParameter("disable", false);
        return session;
    }

    /**
     * Method gets information about all groups from DB
     *
     * @return List of all groups with ASC sorting by title
     */
    @Override
    public List<Group> getAll() {
        log.info("In getAll()");
        return getSession()
                .createQuery(GET_ALL_QUERY, Group.class)
                .getResultList();
    }

    /**
     * The method used for getting groups by teacher id for default semester
     * @param id Long id of a teacher
     * @return List of groups
     */
    @Override
    public List<Group> getByTeacherId(Long id) {
        log.info("In repository getByTeacherId(id = [{}])", id);
        return getSession()
                .createQuery(GET_BY_TEACHER_ID, Group.class)
                .setParameter("id", id)
                .getResultList();
    }

    /**
     * The method used for getting by id entity with students
     *
     * @param id Long id of entity
     * @return found entity
     */
    @Override
    public Optional<Group> getWithStudentsById(Long id) {
        log.info("In getWithStudentsById(id = [{}])", id);
        return  sessionFactory.getCurrentSession()
                .createQuery(GET_WITH_STUDENTS_BY_ID_QUERY, Group.class)
                .setParameter("id", id)
                .uniqueResultOptional();
    }


    /**
     * The method used for finding out if group with such title exists
     *
     * @param title String title used to find Group
     * @return true if exists, else - false
     */
    @Override
    public boolean isExistsByTitle(String title) {
        log.info("In isExistsByTitle(title = [{}])", title);
        if(title == null) {
            return false;
        }
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(IS_EXISTS_BY_TITLE_QUERY)
                .setParameter("title", title)
                .getSingleResult();
    }

    /**
     * The method used for finding out if group with such title exists ignoring id
     *
     * @param title String title used to find Group
     * @param id Long id, which is ignored during the search
     * @return true if exists, else - false
     */
    @Override
    public boolean isExistsByTitleIgnoringId(String title, Long id) {
        log.info("In isExistsByTitleIgnoringId(id = [{}], title = [{}])", id, title);
        if(title == null) {
            return false;
        }
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(IS_EXISTS_BY_TITLE_IGNORING_ID_QUERY)
                .setParameter("title", title)
                .setParameter("id", id)
                .getSingleResult();
    }

    /**
     * Method used to verify if group with such id exists
     *
     * @param id long id of the Group
     * @return true if there is no group with such id, false if record with id exists
     */
    @Override
    public boolean isExistsById(Long id) {
        log.info("In isExistsById(id = [{}])", id);
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(IS_EXISTS_BY_ID_QUERY)
                .setParameter("id", id)
                .getSingleResult();
    }

    /**
     * The method used for checking if group is used in Lesson table
     *
     * @param group Group entity is going to be checked
     * @return true if exists lesson related with this group
     */
    @Override
    protected boolean checkReference(Group group) {
        log.info("In checkReference(group = [{}])", group);
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(IS_LESSONS_EXIST_FOR_GROUP_ID_QUERY)
                .setParameter("groupId", group.getId())
                .getSingleResult();
    }
}
