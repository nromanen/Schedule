package com.softserve.repository;

import com.softserve.entity.interfaces.SortableOrder;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.SortOrderNotExistsException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.Optional;

@Slf4j
@Repository
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class SortOrderRepository<T extends SortableOrder> {
    public SortOrderRepository() {
    }

    private Class<?> tClass = SortOrderRepository.class;
    private SessionFactory sessionFactory;

    private final String isExistsById
            = "SELECT (count(*) > 0)"
            + "FROM " + tClass.getSimpleName() + " c "
            + "WHERE c.id = :id";

    private String updateOffset
            = "UPDATE " + tClass.getSimpleName() + " c "
            + "SET c.sortOrder = c.sortOrder+1 "
            + "WHERE c.sortOrder >= :lower AND c.sortOrder < :upper";

    private String getOrderById
            = "SELECT c.sortOrder "
            + "FROM " + tClass.getSimpleName() + " c "
            + "WHERE c.id = :id";

    private String getMaxSortOrder
            = "SELECT max(c.sortOrder) "
            + "FROM " + tClass.getSimpleName() + " c";

    @Autowired
    public SortOrderRepository(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public T createAfterOrder(T t, Long afterId) {
        log.info("Entered createAfterOrder({}, {})", afterId, t);
        Integer maxOrder = getMaxSortOrder().orElse(0);
        Integer order;
        if (afterId != null && afterId != 0) {
            order = getSortOrderById(afterId).orElseThrow(() -> new SortOrderNotExistsException(tClass, afterId)) + 1;
            t.setSortOrder(order);
            changeOrderOffset(order, maxOrder + 1);
        } else {
            t.setSortOrder(1);
            changeOrderOffset(0, maxOrder + 1);
        }
        sessionFactory.getCurrentSession().save(t);
        return t;
    }

    public T updateAfterOrder(T t, Long afterId) {
        log.info("Entered updateAfterOrder({}, {})", t, afterId);
        if (!isExistsById(t.getId())) {
            throw new EntityNotFoundException(tClass);
        }
        if (t.getId().equals(afterId)) {
            return t;
        }
        Integer maxOrder = getMaxSortOrder().orElse(0);
        if (afterId != null && afterId != 0) {
            Integer lowerBound = getSortOrderById(afterId).orElseThrow(() -> new SortOrderNotExistsException(tClass, afterId)) + 1;
            Integer upperBound = Optional.ofNullable(t.getSortOrder()).orElse(maxOrder + 1) + 1;
            t.setSortOrder(lowerBound);
            changeOrderOffset(lowerBound, upperBound);
        } else {
            t.setSortOrder(1);
            changeOrderOffset(0, maxOrder + 1);
        }
        sessionFactory.getCurrentSession().update(t);
        return t;
    }

    public boolean isExistsById(Long id) {
        log.info("In isExistsById(id = [{}])", id);
        return (boolean) sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT (count(*) > 0)"
                        + "FROM " + tClass.getSimpleName() + " c "
                        + "WHERE c.id = :id")
                .setParameter("id", id)
                .getSingleResult();
    }

    public void changeOrderOffset(Integer lower, Integer upper) {
        log.info("Entered changeOrderOffset({}, {})", lower, upper);
        TypedQuery<?> typedQuery = sessionFactory.getCurrentSession().createQuery(
                "UPDATE " + tClass.getSimpleName() + " c "
                + "SET c.sortOrder = c.sortOrder+1 "
                + "WHERE c.sortOrder >= :lower AND c.sortOrder < :upper");
        typedQuery.setParameter("lower", lower)
                .setParameter("upper", upper);
        int updated = typedQuery.executeUpdate();
        log.debug("Updated order of {} {}s", updated, tClass.getSimpleName());
    }

    public Optional<Integer> getSortOrderById(Long id) {
        log.info("Entered getSortOrderById({})", id);
        return sessionFactory.getCurrentSession().createQuery(
                        "SELECT c.sortOrder "
                                + "FROM " + tClass.getSimpleName() + " c "
                                + "WHERE c.id = :id", Integer.class)
                .setParameter("id", id)
                .uniqueResultOptional();
    }

    public Optional<Integer> getMaxSortOrder() {
        log.debug("Entered getMaxSortOrder()");
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT max(c.sortOrder) "
                        + "FROM " + tClass.getSimpleName() + " c", Integer.class)
                .uniqueResultOptional();
    }

    public void settClass(Class<?> tClass) {
        this.tClass = tClass;
    }
}
