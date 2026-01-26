package com.softserve.controller;

import org.redisson.api.RKeys;
import org.redisson.api.RedissonClient;
import org.redisson.api.options.KeysScanOptions;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Admin controller for Redis cache management.
 * TODO: move logic to service
 */
@RestController
@RequestMapping("/admin/cache")
@PreAuthorize("hasRole('MANAGER')")
@Profile("!test")
public class AdminCacheController {

    private final RedissonClient redissonClient;
    private final CacheManager cacheManager;

    public AdminCacheController(RedissonClient redissonClient, CacheManager cacheManager) {
        this.redissonClient = redissonClient;
        this.cacheManager = cacheManager;
    }

    @GetMapping("/names")
    public ResponseEntity<Collection<String>> getCacheNames() {
        return ResponseEntity.ok(cacheManager.getCacheNames());
    }

    @GetMapping("/keys")
    public ResponseEntity<List<String>> getAllKeys() {
        RKeys keys = redissonClient.getKeys();
        List<String> keyList = keys.getKeysStream()
                .limit(1000)
                .collect(Collectors.toList());
        return ResponseEntity.ok(keyList);
    }

    @GetMapping("/keys/search")
    public ResponseEntity<List<String>> getKeysByPattern(@RequestParam String pattern) {
        RKeys keys = redissonClient.getKeys();
        KeysScanOptions options = KeysScanOptions.defaults()
                .pattern("*" + pattern + "*");
        List<String> keyList = keys.getKeysStream(options)
                .limit(1000).toList();
        return ResponseEntity.ok(keyList);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        RKeys keys = redissonClient.getKeys();
        stats.put("totalKeys", keys.count());


        Map<String, Long> cacheCounts = new HashMap<>();
        for (String cacheName : cacheManager.getCacheNames()) {
            KeysScanOptions options = KeysScanOptions.defaults()
                    .pattern("*" + cacheName + "*");
            long count = keys.getKeysStream(options).count();
            cacheCounts.put(cacheName, count);
        }
        stats.put("cacheStats", cacheCounts);

        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{cacheName}")
    public ResponseEntity<Map<String, String>> clearCache(@PathVariable String cacheName) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Cache '" + cacheName + "' cleared"
            ));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Map<String, String>> clearAllCaches() {
        cacheManager.getCacheNames().forEach(name -> {
            var cache = cacheManager.getCache(name);
            if (cache != null) {
                cache.clear();
            }
        });
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "All caches cleared"
        ));
    }

    @DeleteMapping("/flush")
    public ResponseEntity<Map<String, String>> flushAll() {
        redissonClient.getKeys().flushdb();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Redis database flushed"
        ));
    }

    @DeleteMapping("/keys/pattern")
    public ResponseEntity<Map<String, Object>> deleteByPattern(@RequestParam String pattern) {
        long deleted = redissonClient.getKeys().deleteByPattern("*" + pattern + "*");
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "deletedCount", deleted
        ));
    }
}
