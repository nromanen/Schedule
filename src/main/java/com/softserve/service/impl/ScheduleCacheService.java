package com.softserve.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

/**
 * Service responsible for cache eviction operations related to schedules.
 * Separated from ScheduleServiceImpl to ensure Spring AOP proxying works correctly
 * for cache annotations when called from within the same class.
 */
@Service
@Slf4j
public class ScheduleCacheService {

    /**
     * Evicts all schedule-related caches for a specific semester, group, and teacher.
     * Use this after save/update operations.
     *
     * @param semesterId the semester ID
     * @param groupId    the group ID
     * @param teacherId  the teacher ID
     */
    @Caching(evict = {
            @CacheEvict(value = "semesterSchedules", key = "#semesterId"),
            @CacheEvict(value = "scheduleDTO", key = "#semesterId"),
            @CacheEvict(value = "scheduleForGroup", key = "#semesterId + '-' + #groupId"),
            @CacheEvict(value = "scheduleForTeacher", key = "#semesterId + '-' + #teacherId")
    })
    public void evictCachesForSchedule(Long semesterId, Long groupId, Long teacherId) {
        log.info("Evicting caches for semesterId: {}, groupId: {}, teacherId: {}", semesterId, groupId, teacherId);
    }

    /**
     * Evicts all schedule-related caches for a specific semester, group, and teacher,
     * including lessons cache. Use this after delete operations.
     * @param semesterId the semester ID
     * @param groupId    the group ID
     * @param teacherId  the teacher ID
     */
    @Caching(evict = {
            @CacheEvict(value = "semesterSchedules", key = "#semesterId"),
            @CacheEvict(value = "scheduleDTO", key = "#semesterId"),
            @CacheEvict(value = "scheduleForGroup", key = "#semesterId + '-' + #groupId"),
            @CacheEvict(value = "scheduleForTeacher", key = "#semesterId + '-' + #teacherId"),
            @CacheEvict(value = "lessons", key = "#groupId")
    })
    public void evictCachesForScheduleWithLessons(Long semesterId, Long groupId, Long teacherId) {
        log.info("Evicting caches (including lessons) for semesterId: {}, groupId: {}, teacherId: {}",
                semesterId, groupId, teacherId);
    }

    /**
     * Evicts all schedule-related caches globally.
     * Use this for bulk operations like clearing all schedules for a semester.
     */
    @Caching(evict = {
            @CacheEvict(value = "semesterSchedules", allEntries = true),
            @CacheEvict(value = "scheduleDTO", allEntries = true),
            @CacheEvict(value = "scheduleForGroup", allEntries = true),
            @CacheEvict(value = "scheduleForTeacher", allEntries = true)
    })
    public void evictAllScheduleCaches() {
        log.info("Evicting all schedule caches");
    }
}
