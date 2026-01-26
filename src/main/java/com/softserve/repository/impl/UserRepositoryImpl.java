package com.softserve.repository.impl;

import com.softserve.entity.User;
import com.softserve.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class UserRepositoryImpl extends BasicRepositoryImpl<User, Long> implements UserRepository {

    @Override
    public Optional<User> findByEmail(String email) {
        log.info("Enter into findByEmail method with email:{}", email);
        List<User> users = sessionFactory.getCurrentSession()
                .createNamedQuery("findEmail", User.class)
                .setParameter("email", email)
                .setMaxResults(1)
                .getResultList();
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    @Override
    public Optional<User> findByToken(String token) {
        log.info("Enter into findByToken with token:{}", token);
        List<User> users = sessionFactory.getCurrentSession()
                .createNamedQuery("findToken", User.class)
                .setParameter("token", token)
                .setMaxResults(1)
                .getResultList();
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    @Override
    public List<User> getAllUsersWithRoleUser() {
        log.info("Enter into getAllUsersWithRoleUser of UserRepositoryImpl");
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT u FROM AppUser u WHERE u.role = 'ROLE_USER'", User.class)
                .getResultList();
    }

    @Override
    public User update(User entity) {
        log.info("Enter into update method with entity:{}", entity);
        return sessionFactory.getCurrentSession().merge(entity);
    }

    @Override
    protected boolean checkReference(User user) {
        log.info("In checkReference(user = [{}])", user);
        Long count = sessionFactory.getCurrentSession()
                .createQuery("SELECT count(t.id) FROM Teacher t WHERE t.userId = :userId", Long.class)
                .setParameter("userId", user.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public int deleteUnverifiedOlderThan(LocalDateTime threshold) {
        log.info("Deleting unverified users older than {}", threshold);
        return sessionFactory.getCurrentSession()
                .createMutationQuery(
                        "DELETE FROM AppUser u WHERE u.token IS NOT NULL AND u.createdAt < :threshold")
                .setParameter("threshold", threshold)
                .executeUpdate();
    }
}
