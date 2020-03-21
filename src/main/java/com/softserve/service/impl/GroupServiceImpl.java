package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import com.softserve.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class GroupServiceImpl  implements GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Override
    public Group getById(Long id) {
        return groupRepository.findById(id).orElseThrow(()-> new RuntimeException("Exception"));
    }

    @Override
    public List<Group> getAll() {
        return groupRepository.getAll();
    }

    @Override
    public Group save(Group object) {
        return groupRepository.save(object);
    }

    @Override
    public Group update(Group object) {
        return groupRepository.update(object);
    }

    @Override
    public Group delete(Group object) {
        return groupRepository.delete(object);
    }
}
