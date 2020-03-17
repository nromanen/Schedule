package com.softserve.repository.impl;

import com.softserve.entity.Room;
import com.softserve.repository.RoomRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class RoomRepositoryImpl extends BasicRepositoryImpl<Room, Long> implements RoomRepository {

    @Override
    public List<Room> freeRoomBySpecificPeriod(String nameOfPeriod) {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery
                ("select r1 from " + basicClass.getName() + " r1" +
                        " where r1.id not in" +
                        "(select r.id from Schedule s" +
                        " inner join s.room r " +
                        " inner join s.period p " +
                        " where p.name = :nameOfPeriod)")
                .setParameter("nameOfPeriod", nameOfPeriod);
        List<Room> res = query.getResultList();
        return new ArrayList<>(res);
    }
}
