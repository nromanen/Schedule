package com.softserve.repository.impl;

import com.softserve.entity.Room;
import com.softserve.entity.enums.RoomSize;
import com.softserve.repository.RoomRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class RoomRepositoryImpl extends BasicRepositoryImpl<Room, Long> implements RoomRepository {

    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, String dayOfWeek) {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery
                ("select r1 from " + basicClass.getName() + " r1" +
                        " where r1.id not in" +
                        "(select r.id from Schedule s" +
                        " join s.room r " +
                        " where  s.period.id = :idOfPeriod" +
                        " and s.dayOfWeek = :dayOfWeek)")
                .setParameter("idOfPeriod", idOfPeriod)
                .setParameter("dayOfWeek", dayOfWeek);
        List<Room> res = query.getResultList();
        return new ArrayList<>(res);
    }
}
