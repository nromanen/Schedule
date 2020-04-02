package com.softserve.repository;

import com.softserve.entity.Lesson;
import java.util.List;

public interface LessonRepository extends BasicRepository <Lesson, Long>  {

    List <Lesson> getAllForGroup(Long groupId);
    Long countLessonDuplicates(Lesson lesson);
}
