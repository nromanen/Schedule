package com.softserve.repository;

import com.softserve.exception.DeleteDisabledException;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

public interface BasicRepository<T extends Serializable, I extends Serializable> {

    /**
     * The method used for getting entity by id from database
     *
     * @param id Identity number of entity
     * @return entity
     */
    Optional<T> findById(I id);

    /**
     * The method used for getting list of entities from database
     *
     * @return list of entities
     */
    List<T> getAll();

    /**
     * The method used for saving entity in database
     *
     * @param entity entity is going to be saved
     * @return entity that has been saved
     */
    T save(T entity);

    /**
     * The method used for updating existed entity from database
     *
     * @param entity entity is going to be updated
     * @return entity that was updated
     */
    T update(T entity);

    /**
     * The method used for deleting existed entity from database
     *
     * @param entity entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    T delete(T entity);

    /**
     * The method used for getting list of disabled entities from database
     *
     * @return list
     */
    List<T> getDisabled();
}