package com.softserve.repository.impl;


import com.softserve.entity.Teacher;
import com.softserve.repository.TeacherRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class TeacherRepositoryImpl extends BasicRepositoryImpl<Teacher, Long> implements TeacherRepository {
}
