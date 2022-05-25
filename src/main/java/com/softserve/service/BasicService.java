package com.softserve.service;

import java.io.Serializable;
import java.util.List;

interface BasicService<T extends Serializable, I extends Serializable> {

    T getById(I id);

    List<T> getAll();

    T save(T object);

    T update(T object);

    T delete(T object);
}
