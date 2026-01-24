package com.softserve.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.spring.cache.CacheConfig;
import org.redisson.spring.cache.RedissonSpringCacheManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
@Profile("!test")
public class CacheConfiguration {

    @Value("${redis.address:redis://127.0.0.1:6379}")
    private String redisAddress;

    private static final long HOUR = 60 * 60 * 1000L;
    private static final long MINUTE = 60 * 1000L;

    @Bean(destroyMethod = "shutdown")
    RedissonClient redisson() {
        Config config = new Config();
        config.useSingleServer()
                .setAddress(redisAddress);
//        config.setCodec(new KryoCodec());
        return Redisson.create(config);
    }

    @Bean
    CacheManager cacheManager(RedissonClient redissonClient) {
        Map<String, CacheConfig> config = new HashMap<>();

        // Schedule caches (12 hours TTL)
        config.put("scheduleDTO", new CacheConfig(12 * HOUR, 6 * HOUR));
        config.put("scheduleForGroup", new CacheConfig(12 * HOUR, 6 * HOUR));
        config.put("scheduleForTeacher", new CacheConfig(12 * HOUR, 6 * HOUR));
        config.put("semesterSchedules", new CacheConfig(6 * HOUR, 3 * HOUR));

        // Entity caches (24 hours TTL)
        config.put("semesters", new CacheConfig(24 * HOUR, 12 * HOUR));
        config.put("semestersList", new CacheConfig(24 * HOUR, 12 * HOUR));
        config.put("currentSemester", new CacheConfig(24 * HOUR, 12 * HOUR));
        config.put("defaultSemester", new CacheConfig(24 * HOUR, 12 * HOUR));
        config.put("groups", new CacheConfig(24 * HOUR, 12 * HOUR));
        config.put("teachers", new CacheConfig(24 * HOUR, 12 * HOUR));
        config.put("teachersList", new CacheConfig(24 * HOUR, 12 * HOUR));

        // Lesson cache (6 hours TTL)
        config.put("lessons", new CacheConfig(6 * HOUR, 3 * HOUR));

        // Legacy caches
        config.put("map", new CacheConfig(HOUR, 30 * MINUTE));
        config.put("semesterList", new CacheConfig(HOUR, 30 * MINUTE));
        config.put("schedules", new CacheConfig(HOUR, 30 * MINUTE));

        return new RedissonSpringCacheManager(redissonClient, config);
    }
}
