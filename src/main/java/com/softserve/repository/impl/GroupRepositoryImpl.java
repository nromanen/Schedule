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

    /**
     * Method gets information about all groups from DB
     * @return List of all groups with ASCII sorting by title
     */
    @Override
    public List<Group> getAll() {
        log.info("Enter into getAll method of {}", getClass().getName());
        return sessionFactory.getCurrentSession()
                .createQuery("from Group ORDER BY title ASC")
                .getResultList();
    }

    /**
     * The method used for getting Group by title from database
     *
     * @param title String title used to find Group
     * @return Group entity
     */
    @Override
    public Optional<Group> findByTitle(String title) {
        log.info("Enter into findByTitle method of {} with title:{}", getClass().getName(), title);
        return sessionFactory.getCurrentSession().createQuery
                ("FROM Group g WHERE g.title = :title")
                .setParameter("title", title).uniqueResultOptional();
    }
}
