package com.softserve.repository;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

public interface BasicRepository<T extends Serializable, I extends Serializable> {

    Optional<T> findById(I id);

    List<T> getAll();

    T save(T entity);

    T update(T entity);

    T delete(T entity);
}