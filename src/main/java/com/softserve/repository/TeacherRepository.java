package com.softserve.repository;

import com.softserve.entity.Teacher;
import java.util.List;

public interface TeacherRepository extends BasicRepository<Teacher, Long> {
    List<Teacher> getDisabled();

}
