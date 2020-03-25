package com.softserve.repository.impl;

import com.softserve.entity.User;
import com.softserve.repository.UserRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;


@Slf4j
@Repository
public class UserRepositoryImpl extends BasicRepositoryImpl<User, Long> implements UserRepository {

    /**
     * The method used for getting User by email from database
     *
     * @param email String email used to find User by it
     * @return User
     */
    @Override
    public Optional<User> findByEmail(String email) {
        log.info("Enter into update method of {} with email:{}", getClass().getName(), email);
        TypedQuery<User> query = sessionFactory.getCurrentSession().createNamedQuery("findEmail", User.class).setMaxResults(1);
        query.setParameter("email", email);
        List<User> user = query.getResultList();
        if (user.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(query.getResultList().get(0));
    }
    /**
     * Modified update method, which merge entity before updating it
     *
     * @param entity user is going to be updated
     * @return User
     */
    @Override
    public User update(User entity) {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), entity);
        entity = (User) sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().update(entity);
        return entity;
    }

    public User findByUsername(String username) {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("from User user where user.email= :email")
                .setParameter("email", username);
        return (User) query.getResultList().stream().findFirst().orElse(null);
    }
}
