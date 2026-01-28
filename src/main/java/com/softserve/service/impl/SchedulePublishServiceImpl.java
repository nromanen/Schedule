package com.softserve.service.impl;

import com.softserve.dto.ScheduleStatusDTO;
import com.softserve.service.SchedulePublishService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulePublishServiceImpl implements SchedulePublishService {

    private final RedissonClient redissonClient;

    private static final String KEY_HIDDEN = "schedule:hidden";
    private static final String KEY_MESSAGE = "schedule:message";
    private static final String DEFAULT_MESSAGE = "Розклад з'явиться пізніше";

    @Override
    public void publish() {
        log.info("Publishing schedule");
        redissonClient.getBucket(KEY_HIDDEN).delete();
    }

    @Override
    public void unpublish() {
        log.info("Unpublishing schedule");
        redissonClient.getBucket(KEY_HIDDEN).set(true);
    }

    @Override
    public void unpublish(String message) {
        log.info("Unpublishing schedule with message: {}", message);
        redissonClient.getBucket(KEY_HIDDEN).set(true);
        redissonClient.getBucket(KEY_MESSAGE).set(message);
    }

    @Override
    public boolean isPublished() {
        Boolean hidden = (Boolean) redissonClient.getBucket(KEY_HIDDEN).get();
        return !Boolean.TRUE.equals(hidden);
    }

    @Override
    public String getMessage() {
        String message = (String) redissonClient.getBucket(KEY_MESSAGE).get();
        return message != null ? message : DEFAULT_MESSAGE;
    }

    @Override
    public ScheduleStatusDTO getStatus() {
        Boolean hidden = (Boolean) redissonClient.getBucket(KEY_HIDDEN).get();
        boolean published = !Boolean.TRUE.equals(hidden);

        String message = null;
        if (!published) {
            message = (String) redissonClient.getBucket(KEY_MESSAGE).get();
            if (message == null) {
                message = DEFAULT_MESSAGE;
            }
        }

        return new ScheduleStatusDTO(published, message);
    }
}
