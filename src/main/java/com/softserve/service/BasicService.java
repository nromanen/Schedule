package com.softserve.service;


import java.io.Serializable;
import java.util.List;
import java.util.Optional;


interface BasicService<T extends Serializable, I extends Serializable> {

    Optional<T> getById(I id);

    List<T> getAll();

    T save(T object);

    T update(T object);

    T delete(T object);
}