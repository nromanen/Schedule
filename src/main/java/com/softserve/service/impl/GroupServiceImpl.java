package com.softserve.service.impl;

import com.softserve.entity.Group;
import com.softserve.repository.GroupRepository;
import com.softserve.service.GroupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
@Slf4j
public class GroupServiceImpl  implements GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Override
    public Group getById(Long id) {
        log.info("Enter into getById of GroupServiceImpl with id {}", id);
        return groupRepository.findById(id).orElseThrow(()-> new RuntimeException("Exception"));
    }

    @Override
    public List<Group> getAll() {

        log.info("Enter into getAll of GroupServiceImpl");
        return groupRepository.getAll();
    }

    @Override
    public Group save(Group object) {

        log.info("Enter into save of GroupServiceImpl with entity:{}", object );
        return groupRepository.save(object);
    }

    @Override
    public Group update(Group object) {
        log.info("Enter into update of GroupServiceImpl with entity:{}", object);
        return groupRepository.update(object);
    }

    @Override
    public Group delete(Group object) {
        log.info("Enter into delete of GroupServiceImpl with entity:{}", object);
        return groupRepository.delete(object);
    }
}
