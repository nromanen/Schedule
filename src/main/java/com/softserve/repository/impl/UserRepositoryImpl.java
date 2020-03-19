package com.softserve.repository.impl;

import com.softserve.entity.User;
import com.softserve.repository.UserRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl extends BasicRepositoryImpl<User, Long> implements UserRepository {

    public User findByUsername(String username) {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("from User user where user.email= :email")
                .setParameter("email", username);
        return (User) query.getResultList().stream().findFirst().orElse(null);
    }
}
