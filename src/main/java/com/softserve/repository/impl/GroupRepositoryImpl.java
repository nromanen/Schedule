package com.softserve.repository.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import org.springframework.stereotype.Repository;

@Repository
public class GroupRepositoryImpl extends BasicRepositoryImpl<Group, Long> implements GroupRepository {
}
