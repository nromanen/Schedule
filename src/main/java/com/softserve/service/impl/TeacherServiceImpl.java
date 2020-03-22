package com.softserve.service.impl;

import com.softserve.entity.Teacher;
import com.softserve.exception.TeachersException;
import com.softserve.repository.TeacherRepository;
import com.softserve.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;

    @Autowired
    public TeacherServiceImpl(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }


    @Override
    public Teacher getById(Long id) {
        return teacherRepository.findById(id).orElseThrow(
                () -> new TeachersException("teacher doesn't exist")
        );
    }

    @Override
    public List<Teacher> getAll() {
        return teacherRepository.getAll();
    }

    @Override
    public Teacher save(Teacher object) {
        return teacherRepository.save(object);
    }

    @Override
    public Teacher update(Teacher object) {
        return teacherRepository.update(object);
    }

    @Override
    public Teacher delete(Teacher object) {
        return teacherRepository.delete(object);
    }
}
