package com.softserve.service.impl;

import com.softserve.entity.Lesson;
import com.softserve.repository.LessonRepository;
import com.softserve.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public Lesson getById(Long id) {
        return lessonRepository.findById(id).orElseThrow(()-> new RuntimeException("Exception"));
    }

    @Override
    public List<Lesson> getAll() {
        return lessonRepository.getAll();
    }

    @Override
    public Lesson save(Lesson object) {
        if (object.getTeacherForSite().isEmpty() || object.getTeacherForSite() == null)
        {object.setTeacherForSite(object.getTeacher().getSurname()
                + " "+ object.getTeacher().getName()
                + " " + object.getTeacher().getPatronymic());
        }
        if (object.getSubjectForSite().isEmpty() || object.getSubjectForSite() == null)
        {
            object.setSubjectForSite(object.getSubject().getName());
        }
        return lessonRepository.save(object);
    }

    @Override
    public Lesson update(Lesson object) {
        return lessonRepository.update(object);
    }

    @Override
    public Lesson delete(Lesson object) {
        return lessonRepository.delete(object);
    }

    @Override
    public List<Lesson> getAllForGroup(Long groupId) {
        return lessonRepository.getAllForGroup(groupId);
    }
}
