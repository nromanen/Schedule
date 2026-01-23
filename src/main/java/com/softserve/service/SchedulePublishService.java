package com.softserve.service;

import com.softserve.dto.ScheduleStatusDTO;

/**
 * Service for managing schedule visibility to students.
 *
 * <p>Controls whether the schedule is published and visible to students
 * or hidden while being prepared by administrators.</p>
 *
 * <p>By default, the schedule is published. Administrators can hide it
 * when preparing a new semester schedule.</p>
 */
public interface SchedulePublishService {

    /**
     * Publishes the schedule, making it visible to students.
     */
    void publish();

    /**
     * Hides the schedule from students.
     *
     * <p>Use this when preparing a new schedule that is not yet ready
     * for public viewing.</p>
     */
    void unpublish();

    /**
     * Checks if the schedule is currently published.
     *
     * @return {@code true} if the schedule is visible to students,
     *         {@code false} if it is hidden
     */
    boolean isPublished();

    void unpublish(String message);

    String getMessage();

    ScheduleStatusDTO getStatus();
}
