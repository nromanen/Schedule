package com.softserve.service.impl;

import com.softserve.entity.Teacher;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class TeacherServiceImpl implements TeacherService {


    private final TeacherRepository teacherRepository;

    @Autowired
    public TeacherServiceImpl(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }


    @Override
    public Optional<Teacher> getById(Long id) {
        return Optional.empty();
    }

    @Override
    public List<Teacher> getAll() {
        return teacherRepository.getAll();
    }

    @Override
    public Teacher save(Teacher object) {
        return null;
    }

    @Override
    public Teacher update(Teacher object) {
        return null;
    }

    @Override
    public Teacher delete(Teacher object) {
        return null;
    }

}
