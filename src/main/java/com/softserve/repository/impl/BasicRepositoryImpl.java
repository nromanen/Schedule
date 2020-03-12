package com.softserve.repository.impl;

import com.softserve.repository.BasicRepository;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Optional;


@Repository
@SuppressWarnings("unchecked")
public abstract class BasicRepositoryImpl<T extends Serializable, I extends Serializable> implements BasicRepository<T, I> {

    protected final Class<T> clazz;

    @Autowired
    protected SessionFactory sessionFactory;


    public BasicRepositoryImpl() {
        clazz = (Class<T>) ((ParameterizedType) getClass()
                .getGenericSuperclass())
                .getActualTypeArguments()[0];
    }

    @Override
    public List<T> getAll() {
        return sessionFactory.getCurrentSession()
                .createQuery("from " + clazz.getName())
                .getResultList();
    }

    @Override
    public Optional<T> findById(I id) {
        return Optional.ofNullable(sessionFactory.getCurrentSession().get(clazz, id));
    }

    @Transactional
    @Override
    public T save(T entity) {
        sessionFactory.getCurrentSession()
                .save(entity);
        return entity;
    }

    @Override
    public T update(T entity) {
        sessionFactory.getCurrentSession()
                .update(entity);
        return entity;
    }

    @Override
    public T delete(T entity) {
        sessionFactory.getCurrentSession()
                .remove(entity);
        return  entity;

    }

}