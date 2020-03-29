package com.softserve.service;

import com.softserve.entity.Subject;

public interface SubjectService extends BasicService<Subject, Long> {
    boolean findByName(String name);
}
