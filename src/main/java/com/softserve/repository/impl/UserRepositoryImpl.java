package com.softserve.repository.impl;

import com.softserve.entity.User;
import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.UserRepository;
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
        log.info("Enter into findByEmail method with email:{}", email);
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
        log.info("Enter into update method with entity:{}", entity);
        entity = (User) sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().update(entity);
        return entity;
    }

    /**
     * The method used for deleting object in database, checking references before it
     *
     * @param entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    @Override
    public User delete(User entity) {
        if (checkReference(entity.getId())) {
            throw new DeleteDisabledException("Unable to delete object, till another object is referenced on it");
        }
        return super.delete(entity);
    }

    // Checking by id if user is used in Lesson table
    private boolean checkReference(Long userId) {
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (t.id) " +
                        "from Teacher t where t.userId.id = :userId")
                .setParameter("userId", userId)
                .getSingleResult();
        return count != 0;
    }
}
