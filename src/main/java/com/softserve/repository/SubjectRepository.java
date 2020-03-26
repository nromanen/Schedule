package com.softserve.repository;

import com.softserve.entity.Subject;

import java.util.Optional;

public interface SubjectRepository extends BasicRepository<Subject, Long> {

    Optional<Subject> findByName(String name);
}
