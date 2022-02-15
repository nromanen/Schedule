package com.softserve.repository.impl;

import com.softserve.entity.RoomType;
import com.softserve.repository.RoomTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class RoomTypeRepositoryImpl extends BasicRepositoryImpl<RoomType, Long> implements RoomTypeRepository {

    /**
     * The method used for getting number of RoomTypes with description from database
     *
     * @param description String description used to find RoomType
     * @return Long number of records with description
     */
    @Override
    public Long countRoomTypesWithDescription(String description) {
        log.info("In countRoomTypesWithDescription(description = [{}])", description);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM RoomType r WHERE r.description = :description")
                .setParameter("description", description).getSingleResult();
    }

    /**
     * Method used to verify if RoomType with such id exists
     *
     * @param id of the RoomType
     * @return 0 if there is no RoomType with such id, 1 if record with id exists
     */
    @Override
    public Long countByRoomTypeId(Long id) {
        log.info("In countByRoomTypeId(id = [{}])", id);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM RoomType r WHERE r.id = :id")
                .setParameter("id", id).getSingleResult();
    }

    // Checking if RoomType is used in Room table
    @Override
    protected boolean checkReference(RoomType roomType) {
        log.info("In checkReference(roomType = [{}])", roomType);
        Long count = (Long) sessionFactory.getCurrentSession().createQuery
                ("select count (r.id) " +
                        "from Room r where r.type.id = :roomTypeId")
                .setParameter("roomTypeId", roomType.getId())
                .getSingleResult();
        return count != 0;
    }
}
