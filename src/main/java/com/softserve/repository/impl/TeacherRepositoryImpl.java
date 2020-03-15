package com.softserve.repository.impl;


import com.softserve.entity.Teacher;
import com.softserve.repository.TeacherRepository;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;


@Repository
public class TeacherRepositoryImpl extends BasicRepositoryImpl<Teacher, Long> implements TeacherRepository {
    public TeacherRepositoryImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }
}
