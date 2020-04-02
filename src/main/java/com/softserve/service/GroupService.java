package com.softserve.service;

import com.softserve.entity.Group;

public interface GroupService extends BasicService<Group, Long> {
    boolean isGroupExistsWitTitle(String title);
    boolean isExistsWithId(Long id);
}
