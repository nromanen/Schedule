package com.softserve.service;

import com.softserve.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCleanupService {

    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 3 * * *")
//    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void cleanupUnverifiedUsers() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(7);
        int deleted = userRepository.deleteUnverifiedOlderThan(threshold);
        log.info("Deleted {} unverified users older than {}", deleted, threshold);
    }
}
