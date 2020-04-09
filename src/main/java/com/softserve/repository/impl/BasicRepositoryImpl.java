package com.softserve.repository.impl;

import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.BasicRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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

    /**
     * The method used for getting list of entities from database
     *
     * @return list of entities
     */
    @Override
    public List<T> getAll() {
        log.info("In getAll()");
        return sessionFactory.getCurrentSession()
                .createQuery("from " + basicClass.getName())
                .getResultList();
    }

    /**
     * The method used for getting entity by id from database
     *
     * @param id Identity number of entity
     * @return entity
     */
    @Override
    public Optional<T> findById(I id) {
        log.info("In findById(id = [{}])", id);
        return Optional.ofNullable(sessionFactory.getCurrentSession().get(basicClass, id));
    }

    /**
     * The method used for saving entity in database
     *
     * @param entity entity is going to be saved
     * @return entity that has been saved
     */
    @Override
    public T save(T entity) {
        log.info("In save(entity = [{}]", entity);
        sessionFactory.getCurrentSession()
                .save(entity);
        return entity;
    }

    /**
     * The method used for updating existed entity from database
     *
     * @param entity entity is going to be updated
     * @return entity that was updated
     */
    @Override
    public T update(T entity) {
        log.info("In update(entity = [{}]", entity);
        sessionFactory.getCurrentSession()
                .update(entity);
        return entity;
    }

    /**
     * The method used for deleting existed entity from database
     *
     * @param entity entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    @Override
    public T delete(T entity) {
        log.info("In delete(entity = [{}])", entity);
        if (checkReference(entity)) {
            throw new DeleteDisabledException(entity.getClass());
        }
        sessionFactory.getCurrentSession()
                .remove(entity);
        return entity;
    }

    /**
     * The method used for checking if entity is used in another tables
     *
     * @param entity entity is going to be checked
     * @return true if there's constraint violation
     */
    @Override
    public boolean checkReference(T entity) {
        log.info("In checkReference(entity = [{}])", entity);
        return false;
    }
}