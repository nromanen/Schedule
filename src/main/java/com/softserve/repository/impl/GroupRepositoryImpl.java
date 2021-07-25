package com.softserve.repository.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class GroupRepositoryImpl extends BasicRepositoryImpl<Group, Long> implements GroupRepository {

    private static final String GET_ALL_QUERY = "SELECT DISTINCT g FROM Group g LEFT JOIN FETCH g.students ORDER BY g.title ASC";
    private static final String GET_BY_ID_QUERY = "SELECT g FROM Group g LEFT JOIN FETCH g.students WHERE g.id = :id";
    private static final String GET_DISABLED_QUERY = "SELECT DISTINCT g FROM Group g LEFT JOIN FETCH g.students WHERE g.disable = true ORDER BY g.title ASC";
    private static final String COUNT_GROUPS_WITH_TITLE_QUERY = "SELECT COUNT (*) FROM Group g WHERE g.title = :title";
    private static final String COUNT_GROUPS_WITH_TITLE_AND_IGNORE_WITH_ID_QUERY =
            "SELECT COUNT (*) FROM Group g WHERE g.title = :title AND g.id!=:id";
    private static final String COUNT_BY_GROUP_ID_QUERY = "SELECT COUNT (*) FROM Group g WHERE g.id = :id";
    private static final String CHECK_REFERENCE_QUERY = "SELECT COUNT (l.id) " +
            "FROM Lesson l WHERE l.group.id = :groupId";

    private Session getSession(){
        Session session = sessionFactory.getCurrentSession();
        Filter filter = session.enableFilter("groupDisableFilter");
        filter.setParameter("disable", false);
        return session;
    }

    /**
     * Method gets information about all groups from DB
     *
     * @return List of all groups with ASCII sorting by title
     */
    @Override
    public List<Group> getAll() {
        log.info("In getAll()");
        return getSession().createQuery(GET_ALL_QUERY).getResultList();
    }

    /**
     * Overrided method that returns entity with JOIN FETCH (students)
     *
     * @param id Long id of entity
     * @return found entity
     */
    @Override
    public Group getById(Long id) {
        log.info("In getById(id = [{}])", id);
        return (Group) getSession().createQuery(GET_BY_ID_QUERY).setParameter("id", id).uniqueResult();
    }

    /**
     * Method gets information about groups that have property "disabled" = true
     *
     * @return List of groups with ASCII sorting by title
     */
    @Override
    public List<Group> getDisabled() {
        log.info("In getDisabled()");
        return sessionFactory.getCurrentSession().createQuery(GET_DISABLED_QUERY).getResultList();
    }

    /**
     * The method used for getting number of groups with title from database
     *
     * @param title String title used to find Group
     * @return Long number of records with title
     */
    @Override
    public Long countGroupsWithTitle(String title) {
        log.info("In countGroupsWithTitle(title = [{}])", title);
        return (Long) sessionFactory.getCurrentSession().createQuery
                (COUNT_GROUPS_WITH_TITLE_QUERY)
                .setParameter("title", title).getSingleResult();
    }

    /**
     * The method used for getting number of groups with title from database
     *
     * @param id Long id of the Group
     * @param title String title used to find Group
     * @return Long number of records with title
     */
    @Override
    public Long countGroupsWithTitleAndIgnoreWithId(Long id, String title) {
        log.info("In countGroupsWithTitleAndIgnoreWithId(id = [{}], title = [{}])", id, title);
        return (Long) sessionFactory.getCurrentSession().createQuery
                (COUNT_GROUPS_WITH_TITLE_AND_IGNORE_WITH_ID_QUERY)
                .setParameter("title", title).setParameter("id", id).getSingleResult();
    }

    /**
     * Method used to verify if group with such id exists
     *
     * @param id long id of the Group
     * @return 0 if there is no group with such id, 1 if record with id exists
     */
    @Override
    public Long countByGroupId(Long id) {
        log.info("In countByGroupId(id = [{}])", id);
        return (Long) sessionFactory.getCurrentSession().createQuery
                (COUNT_BY_GROUP_ID_QUERY)
                .setParameter("id", id).getSingleResult();
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
        long count = (long) sessionFactory.getCurrentSession().createQuery
                (CHECK_REFERENCE_QUERY)
                .setParameter("groupId", group.getId())
                .getSingleResult();
        return count != 0;
    }
}
