package com.softserve.repository.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
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

    private static final String GET_ALL_BY_ORDER_QUERY
            = "SELECT g "
            + "FROM Group g "
            + "ORDER BY g.sortingOrder ASC, g.title ASC";

    private static final String GET_MAX_SORTING_ORDER
            = "SELECT max(g.sortingOrder) "
            + "FROM Group g";

    private static final String UPDATE_GROUP_OFFSET
            = "UPDATE Group g "
            + "SET g.sortingOrder = g.sortingOrder+1 "
            + "WHERE g.sortingOrder >= :position";

    public static final String GET_NEXT_POSITION
            = "SELECT min(g.sortingOrder) "
            + "FROM Group g "
            + "WHERE g.sortingOrder > :position";


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
     * The method is used to retrieve groups by set sorting order
     *
     * @return the list of groups sorted by set sorting order
     */
    @Override
    public List<Group> getAllBySortingOrder() {
        log.trace("Entered getAllBySortingOrder()");
        return getSession()
                .createQuery(GET_ALL_BY_ORDER_QUERY, Group.class)
                .getResultList();
    }


    /**
     * The method is used to save group after the specific group to get desired order
     * @param group the group that must be saved
     * @param afterId the id of the group after which must be saved the new one
     * @return saved group with set order and id
     */
    @Override
    public Group saveGroupAfterOrder(Group group, Long afterId) {
        log.trace("Entered saveGroupAfterOrder({},{})", group, afterId);
        Optional<Group> groupAfter = super.findById(afterId);
        Double maxOrder = Optional.ofNullable(
                    getSession().createQuery(GET_MAX_SORTING_ORDER, Double.class).getSingleResult()
                ).orElse(0.0);
        log.debug("Max order: {}", maxOrder );
        if (groupAfter.isPresent()) {
            Double order = Optional.ofNullable(groupAfter.get().getSortingOrder()).orElse(maxOrder);
            group.setSortingOrder(order+1);
            changeGroupOrderOffset(order+1);
        } else {
            group.setSortingOrder(maxOrder+1);
        }
        super.save(group);
        return group;
    }

    /**
     * Method updates group order position
     * @param group group that will be replaced
     * @param afterId id of the group after which will be placed
     * @return group with new position
     */
    @Override
    public Group updateGroupOrder(Group group, Long afterId) {
        log.trace("Entered updateGroupOrder({}, {})", group, afterId);
        Optional<Group> previousGroup = super.findById(afterId);
        if (previousGroup.isPresent()) {
            Double previousPosition = Optional.ofNullable(previousGroup.get().getSortingOrder())
                    .orElse(0.0);
            TypedQuery<Double> doubleTypedQuery = getSession().createQuery(GET_NEXT_POSITION, Double.class);
            doubleTypedQuery.setParameter("position", previousPosition);
            Double nextPosition =
                    Optional.ofNullable(
                        doubleTypedQuery.getSingleResult()
                    ).orElse(previousPosition+2);
            Double newPosition = ((nextPosition + previousPosition)/2);
            if (newPosition - 1 < 0.01) {
                newPosition = Optional.ofNullable(
                        getSession().createQuery(GET_MAX_SORTING_ORDER, Double.class).getSingleResult()
                ).orElse(0.0) + 1;
            }
            group.setSortingOrder(newPosition);
        } else {
            group.setSortingOrder(1.0);
            changeGroupOrderOffset(0.0);
        }
        super.update(group);
        return group;
    }


    private int changeGroupOrderOffset(Double order) {
        TypedQuery<Group> groupTypedQuery = getSession().createQuery(UPDATE_GROUP_OFFSET);
        groupTypedQuery.setParameter("position", order);
        int updated = groupTypedQuery.executeUpdate();
        log.debug("Updated order of {} groups", updated);
        return updated;
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
