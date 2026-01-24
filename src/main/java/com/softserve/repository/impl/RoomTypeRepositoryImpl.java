package com.softserve.repository.impl;

import com.softserve.entity.RoomType;
import com.softserve.repository.RoomTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class RoomTypeRepositoryImpl extends BasicRepositoryImpl<RoomType, Long> implements RoomTypeRepository {

    @Override
    public Long countRoomTypesWithDescription(String description) {
        log.info("In countRoomTypesWithDescription(description = [{}])", description);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT count(r.id) FROM RoomType r WHERE r.description = :description", Long.class)
                .setParameter("description", description)
                .getSingleResult();
    }

    @Override
    public Long countRoomTypesWithDescriptionAndIgnoreId(Long id, String description) {
        log.info("In countRoomTypesWithDescriptionAndIgnoreId(id = [{}], description = [{}])", id, description);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT count(r.id) FROM RoomType r WHERE r.description = :description AND r.id != :id", Long.class)
                .setParameter("description", description)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public Long countByRoomTypeId(Long id) {
        log.info("In countByRoomTypeId(id = [{}])", id);
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT count(r.id) FROM RoomType r WHERE r.id = :id", Long.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    protected boolean checkReference(RoomType roomType) {
        log.info("In checkReference(roomType = [{}])", roomType);
        Long count = sessionFactory.getCurrentSession()
                .createQuery("SELECT count(r.id) FROM Room r WHERE r.type.id = :roomTypeId", Long.class)
                .setParameter("roomTypeId", roomType.getId())
                .getSingleResult();
        return count != 0;
    }
}
