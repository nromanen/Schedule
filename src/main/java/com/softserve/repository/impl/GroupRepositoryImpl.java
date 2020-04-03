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
     * @return List of all groups with ASCII sorting by title
     */
    @Override
    public List<Group> getAll() {
        log.info("Enter into getAll method");
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
        log.info("Enter into countGroupsWithTitle method with title:{}", title);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Group g WHERE g.title = :title")
                .setParameter("title", title).getSingleResult();
    }

    /**
     * Method used to verify if group with such id exists
     * @param id of the Group
     * @return 0 if there is no group with such id, 1 if record with id exists
     */
    @Override
    public Long existsById(Long id) {
        log.info("Enter into existsById method with id:{}", id);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM Group g WHERE g.id = :id")
                .setParameter("id", id).getSingleResult();
    }
}
