package com.softserve.repository.impl;

import com.softserve.entity.TeacherWishes;
import com.softserve.entity.User;
import com.softserve.repository.TeacherWishesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;


@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class TeacherWishesRepositoryImpl extends BasicRepositoryImpl<TeacherWishes, Long> implements TeacherWishesRepository {
    /**
     * Modified save method, which merge entity before updating it
     *
     * @param entity teacher wishes is going to be saved
     * @return Teacher Wishes
     */
    @Override
    public TeacherWishes save(TeacherWishes entity) {
        log.info("Enter into save method of {} with entity:{}", getClass().getName(), entity);
        entity = (TeacherWishes) sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().save(entity);
        return entity;
    }

    /**
     * Modified update method, which merge entity before updating it
     *
     * @param entity teacher wishes is going to be updated
     * @return Teacher Wishes
     */
    @Override
    public TeacherWishes update(TeacherWishes entity) {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), entity);
        entity = (TeacherWishes) sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().update(entity);
        return entity;
    }
}
