package com.softserve.service.impl;

import com.softserve.entity.Subject;
import com.softserve.repository.SubjectRepository;
import com.softserve.service.SubjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
@Slf4j
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Autowired
    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }


    @Override
    public Subject getById(Long id) {
        log.info("Enter into getById of SubjectServiceImpl with id {}", id);
        return subjectRepository.findById(id).orElseThrow(()-> new RuntimeException("Exception"));
    }

    @Override
    public List<Subject> getAll() {
        log.info("Enter into getAll of SubjectServiceImpl");
        return subjectRepository.getAll();
    }

    @Override
    public Subject save(Subject object) {
        log.info("Enter into save of SubjectServiceImpl with entity:{}", object );
        return subjectRepository.save(object);
    }

    @Override
    public Subject update(Subject object) {
        log.info("Enter into update of SubjectServiceImpl with entity:{}", object);
        return subjectRepository.update(object);
    }

    @Override
    public Subject delete(Subject object) {
        log.info("Enter into delete of SubjectServiceImpl with entity:{}", object);
        return subjectRepository.delete(object);
    }
}
