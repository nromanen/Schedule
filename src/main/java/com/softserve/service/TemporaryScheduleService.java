package com.softserve.service;


import com.softserve.entity.TemporarySchedule;

import java.util.List;

public interface TemporaryScheduleService extends BasicService<TemporarySchedule, Long> {
    List<TemporarySchedule> getAllByTeacher(Long teacherId);
}

