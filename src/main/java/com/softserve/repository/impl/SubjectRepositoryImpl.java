package com.softserve.repository.impl;

import com.softserve.entity.Subject;
import com.softserve.repository.SubjectRepository;
import org.springframework.stereotype.Repository;

@Repository
public class SubjectRepositoryImpl extends BasicRepositoryImpl<Subject, Long> implements SubjectRepository {
}
