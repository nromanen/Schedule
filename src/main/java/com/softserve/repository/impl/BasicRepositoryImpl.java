package com.softserve.repository.impl;

import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.BasicRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public abstract class BasicRepositoryImpl<T extends Serializable, I extends Serializable> implements BasicRepository<T, I> {

    protected final Class<T> basicClass;
    protected SessionFactory sessionFactory;
    private String entityName;


    protected BasicRepositoryImpl() {
        basicClass = (Class<T>) ((ParameterizedType) getClass()
                .getGenericSuperclass())
                .getActualTypeArguments()[0];
    }

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    protected Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    protected String getEntityName() {
        if (entityName == null) {
            jakarta.persistence.Entity entityAnnotation = basicClass.getAnnotation(jakarta.persistence.Entity.class);
            if (entityAnnotation != null && !entityAnnotation.name().isEmpty()) {
                entityName = entityAnnotation.name();
            } else {
                entityName = basicClass.getSimpleName();
            }
            log.info("Entity name for {} is {}", basicClass.getName(), entityName);
        }
            return entityName;
    }


    @Override
    public List<T> getAll() {
        log.info("In getAll()");
        return getSession()
                .createQuery("SELECT t FROM " + getEntityName() + " t", basicClass)
                .getResultList();
    }

    @Override
    public Optional<T> findById(I id) {
        log.info("In findById(id = [{}])", id);
        return Optional.ofNullable(getSession().get(basicClass, id));
    }

    @Override
    public T save(T entity) {
        log.info("In save(entity = [{}]", entity);
        getSession()
                .persist(entity);
        return entity;
    }



    @Override
    public T update(T entity) {
        log.info("In update(entity = [{}]", entity);
        return getSession()
                .merge(entity);
    }

    @Override
    public T delete(T entity) {
        log.info("In delete(entity = [{}])", entity);
        if (checkReference(entity)) {
            throw new DeleteDisabledException(entity.getClass());
        }
        getSession()
                .remove(entity);
        return entity;
    }

    protected boolean checkReference(T entity) {
        log.info("In checkReference(entity = [{}])", entity);
        return false;
    }

    @Override
    public List<T> getDisabled() {
        log.info("In getDisabled");
        return getSession()
                .createQuery("SELECT t FROM " + getEntityName() + " t WHERE t.disable = true", basicClass)
                .getResultList();
    }

    @Override
    public List<T> getEnabled() {
        log.info("In getEnabled");
        return getSession()
                .createQuery("SELECT t FROM " + getEntityName() + " t WHERE t.disable = false", basicClass)
                .getResultList();
    }
}
