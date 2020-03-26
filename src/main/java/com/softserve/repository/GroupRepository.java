package com.softserve.repository;

import com.softserve.entity.Group;

import java.util.Optional;

public interface GroupRepository extends BasicRepository<Group, Long>{

    Optional<Group> findByTitle(String title);
}
