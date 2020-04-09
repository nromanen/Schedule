package com.softserve.repository.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class GroupRepositoryImpl extends BasicRepositoryImpl<Group, Long> implements GroupRepository {

    /**
     * Method gets information about all groups from DB
     *
     * @return List of all groups with ASCII sorting by title
     */
    @Override
    public List<Group> getAll() {
        log.info("In getAll()");
        return sessionFactory.getCurrentSession()
                .createQuery("from Group ORDER BY title ASC")
                .getResultList();
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
                ("SELECT count (*) FROM Group g WHERE g.title = :title")
                .setParameter("title", title).getSingleResult();
    }

    /**
     * Method used to verify if group with such id exists
     *
     * @param id of the Group
     * @return 0 if there is no group with such id, 1 if record with id exists
     */
    @Override
    public Long countByGroupId(Long id) {
        log.info("In countByGroupId(id = [{}])", id);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Group g WHERE g.id = :id")
                .setParameter("id", id).getSingleResult();
    }

    // Checking if group is used in Lesson table
    @Override
    public boolean checkReference(Group group) {
        log.info("In checkReference(group = [{}])", group);
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (l.id) " +
                        "from Lesson l where l.group.id = :groupId")
                .setParameter("groupId", group.getId())
                .getSingleResult();
        return count != 0;
    }
}
