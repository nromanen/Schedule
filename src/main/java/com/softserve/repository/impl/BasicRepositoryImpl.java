package com.softserve.repository.impl;

import com.softserve.repository.BasicRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
@SuppressWarnings("unchecked")
public abstract class BasicRepositoryImpl<T extends Serializable, I extends Serializable> implements BasicRepository<T, I> {

    protected final Class<T> basicClass;

    @Autowired
    protected SessionFactory sessionFactory;

    @Autowired
    public BasicRepositoryImpl() {
        basicClass = (Class<T>) ((ParameterizedType) getClass()
                .getGenericSuperclass())
                .getActualTypeArguments()[0];
    }

    @Override
    public List<T> getAll() {
        log.info("Enter into getAll of BasicRepository");
        return sessionFactory.getCurrentSession()
                .createQuery("from " + basicClass.getName())
                .getResultList();
    }

    @Override
    public Optional<T> findById(I id) {
        log.info("Enter into findById of BasicRepository with id {}", id);
        return Optional.ofNullable(sessionFactory.getCurrentSession().get(basicClass, id));
    }


    @Override
    public T save(T entity) {
        log.info("Enter into save of BasicRepository with entity:{}", entity );
        sessionFactory.getCurrentSession()
                .save(entity);
        return entity;
    }

    @Override
    public T update(T entity) {
        log.info("Enter into update of BasicRepository with entity:{}", entity);
        sessionFactory.getCurrentSession()
                .update(entity);
        return entity;
    }

    @Override
    public T delete(T entity) {
        log.info("Enter into delete of BasicRepository with entity:{}", entity);
        sessionFactory.getCurrentSession()
                .remove(entity);
        return  entity;
    }

}