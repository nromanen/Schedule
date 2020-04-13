package com.softserve.repository;

import com.softserve.entity.Group;

public interface GroupRepository extends BasicRepository<Group, Long>{
    Long countGroupsWithTitle(String title);
    Long countByGroupId(Long id);
}
