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

@Repository
public class RoomRepositoryImpl extends BasicRepositoryImpl<Room, Long> implements RoomRepository {

    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, String dayOfWeek) {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createNativeQuery
                ("select r.* from rooms r " +
                        "where r.id not in " +
                        "( select s.room_id from schedules s " +
                        "  where s.period_id = :idOfPeriod" +
                        "  and s.day_of_week = :dayOfWeek)")
                .setParameter("idOfPeriod", idOfPeriod)
                .setParameter("dayOfWeek", dayOfWeek);
        List<Object[]> list = (List<Object[]>) query.list();
        List<Room> res = new ArrayList<>();
        if (list != null) {
            for (Object[] ob : list) {
                Room room = new Room(((BigInteger) ob[0]).intValue(), RoomSize.valueOf((String) ob[2]), (String) ob[1]);
                res.add(room);
            }
        }
        return res;
    }
}
