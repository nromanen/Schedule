package com.softserve.DAO;

import com.softserve.entity.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAO {

    private final SessionFactory sessionFactory;

    @Autowired
    public UserDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public User get(long id) {
        return sessionFactory.getCurrentSession().get(User.class, id);
    }

    public User findByUsername(String username) {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("from User user where user.username= :i")
                .setParameter("i", username);
        return (User) query.getResultList().stream().findFirst().orElse(null);
    }
}
