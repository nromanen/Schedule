package com.softserve.service.mapper;

public interface Mapper <E, D> {
    E convertToEntity(D dto);

    D convertToDto(E entity);
}