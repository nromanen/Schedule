package com.softserve.repository.impl;

import com.softserve.entity.Lesson;
import com.softserve.entity.Room;
import com.softserve.repository.LessonRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@Slf4j
public class LessonRepositoryImpl extends BasicRepositoryImpl<Lesson, Long> implements LessonRepository {

    public LessonRepositoryImpl() {
    }

    @Override
    public List<Lesson> getAllForGroup(Long groupId) {
        log.info("Enter of {} to take all lessons for group with id = {}", getClass().getName(), groupId);

        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery
                ("FROM Lesson l WHERE l.group.id = :groupId")
                .setParameter("groupId", groupId);
        List<Lesson> res = query.getResultList();
        return res;
    }
}
