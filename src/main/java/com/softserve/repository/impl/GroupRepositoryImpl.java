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
        log.info("Enter into getAll method of {}", getClass().getName());
        return sessionFactory.getCurrentSession()
                .createQuery("from Group ORDER BY title ASC")
                .getResultList();
    }
}
