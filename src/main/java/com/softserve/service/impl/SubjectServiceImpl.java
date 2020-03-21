package com.softserve.service.impl;

import com.softserve.entity.Subject;
import com.softserve.repository.SubjectRepository;
import com.softserve.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Autowired
    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }


    @Override
    public Subject getById(Long id) { return subjectRepository.findById(id).orElseThrow(()-> new RuntimeException("Exception"));
    }

    @Override
    public List<Subject> getAll() {
        return subjectRepository.getAll();
    }

    @Override
    public Subject save(Subject object) {
        return subjectRepository.save(object);
    }

    @Override
    public Subject update(Subject object) {
        return subjectRepository.update(object);
    }

    @Override
    public Subject delete(Subject object) {
        return subjectRepository.delete(object);
    }
}
