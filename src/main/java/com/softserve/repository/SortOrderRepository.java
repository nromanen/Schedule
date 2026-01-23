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

import java.util.Optional;

@Slf4j
@Repository
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class SortOrderRepository<T extends SortableOrder> {

    private Class<?> clazz;
    private String entityName;
    private SessionFactory sessionFactory;

    @Autowired
    public SortOrderRepository(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void settClass(Class<?> tClass) {
        this.clazz = tClass;
        this.entityName = resolveEntityName(tClass);
    }

    private String resolveEntityName(Class<?> clazz) {
        jakarta.persistence.Entity annotation = clazz.getAnnotation(jakarta.persistence.Entity.class);
        if (annotation != null && !annotation.name().isEmpty()) {
            return annotation.name();
        }
        return clazz.getSimpleName();
    }

    public T createAfterOrder(T t, Long afterId) {
        log.info("Entered createAfterOrder({}, {})", afterId, t);

        t.setId(null);

        Integer maxOrder = getMaxSortOrder().orElse(0);
        Integer order;
        if (afterId != null && afterId != 0) {
            order = getSortOrderById(afterId).orElseThrow(() -> new SortOrderNotExistsException(clazz, afterId)) + 1;
            t.setSortOrder(order);
            changeOrderOffset(order, maxOrder + 1);
        } else {
            t.setSortOrder(1);
            changeOrderOffset(0, maxOrder + 1);
        }

        sessionFactory.getCurrentSession().persist(t);
        return t;
    }

    public T updateAfterOrder(T t, Long afterId) {
        log.info("Entered updateAfterOrder({}, {})", t, afterId);
        if (!isExistsById(t.getId())) {
            throw new EntityNotFoundException(clazz);
        }
        if (t.getId().equals(afterId)) {
            return t;
        }
        Integer maxOrder = getMaxSortOrder().orElse(0);
        if (afterId != null && afterId != 0) {
            Integer lowerBound = getSortOrderById(afterId).orElseThrow(() -> new SortOrderNotExistsException(clazz, afterId)) + 1;
            Integer upperBound = Optional.ofNullable(t.getSortOrder()).orElse(maxOrder + 1) + 1;
            t.setSortOrder(lowerBound);
            changeOrderOffset(lowerBound, upperBound);
        } else {
            t.setSortOrder(1);
            changeOrderOffset(0, maxOrder + 1);
        }
        sessionFactory.getCurrentSession().merge(t);
        return t;
    }

    public boolean isExistsById(Long id) {
        log.info("In isExistsById(id = [{}])", id);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT 1 FROM " + entityName + " c WHERE c.id = :id", Integer.class)
                .setParameter("id", id)
                .uniqueResult() != null;
    }

    public void changeOrderOffset(Integer lower, Integer upper) {
        log.info("Entered changeOrderOffset({}, {})", lower, upper);
        int updated = sessionFactory.getCurrentSession()
                .createMutationQuery(
                        "UPDATE " + entityName + " c " +
                                "SET c.sortOrder = c.sortOrder + 1 " +
                                "WHERE c.sortOrder >= :lower AND c.sortOrder < :upper")
                .setParameter("lower", lower)
                .setParameter("upper", upper)
                .executeUpdate();
        log.debug("Updated order of {} {}s", updated, entityName);
    }

    public Optional<Integer> getSortOrderById(Long id) {
        log.info("Entered getSortOrderById({})", id);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT c.sortOrder FROM " + entityName + " c WHERE c.id = :id", Integer.class)
                .setParameter("id", id)
                .uniqueResultOptional();
    }

    public Optional<Integer> getMaxSortOrder() {
        log.debug("Entered getMaxSortOrder()");
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT max(c.sortOrder) FROM " + entityName + " c", Integer.class)
                .uniqueResultOptional();
    }
}
