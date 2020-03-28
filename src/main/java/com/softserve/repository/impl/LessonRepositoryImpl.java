package com.softserve.repository.impl;

import com.softserve.entity.Lesson;
import com.softserve.repository.LessonRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class LessonRepositoryImpl extends BasicRepositoryImpl<Lesson, Long> implements LessonRepository {

    /**
     *  Method gets information about all lessons for particular group from DB
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getAllForGroup(Long groupId) {
        log.info("Enter into  getAllForGroup method of {} to search lessons for group with id = {}", getClass().getName(), groupId);

        return sessionFactory.getCurrentSession().createQuery
                ("FROM Lesson l WHERE l.group.id = :groupId")
                .setParameter("groupId", groupId).getResultList();
    }
}
