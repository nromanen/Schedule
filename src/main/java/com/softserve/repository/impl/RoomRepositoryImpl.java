package com.softserve.repository.impl;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.DeleteDisabledException;
import com.softserve.repository.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Repository
@Slf4j
public class RoomRepositoryImpl extends BasicRepositoryImpl<Room, Long> implements RoomRepository {

    /**
     * The method used for getting list of free room by specific period, day of week and number of week from database
     *
     * @param idOfPeriod identity number of period
     * @param dayOfWeek  day of the week
     * @param evenOdd    number of week
     * @return list of rooms
     */
    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, String dayOfWeek, EvenOdd evenOdd) {
        log.info("Enter into freeRoomBySpecificPeriod of RoomRepositoryImpl with id {}, dayOfWeek {} and evenOdd {} ",
                idOfPeriod, dayOfWeek, evenOdd);
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery
                ("select r1 from " + basicClass.getName() + " r1" +
                        " where r1.id not in" +
                        "(select r.id from Schedule s" +
                        " join s.room r " +
                        " where  s.period.id = :idOfPeriod" +
                        " and s.dayOfWeek = :dayOfWeek" +
                        " and s.evenOdd = :evenOdd)")
                .setParameter("idOfPeriod", idOfPeriod)
                .setParameter("dayOfWeek", dayOfWeek)
                .setParameter("evenOdd", evenOdd);
        List<Room> res = query.getResultList();
        return new ArrayList<>(res);
    }

    @Override
    public List<String> allUniqueRoomTypes() {
        return sessionFactory.getCurrentSession().createQuery("select distinct room.type from Room room").getResultList();
    }

    /**
     * The method used for deleting object in database, checking references before it
     *
     * @param entity is going to be deleted
     * @return deleted entity
     * @throws DeleteDisabledException when there are still references pointing to object requested for deleting
     */
    @Override
    public Room delete(Room entity) {
        if (checkReference(entity.getId())) {
            throw new DeleteDisabledException("Unable to delete object, till another object is referenced on it");
        }
        return super.delete(entity);
    }

    // Checking by id if room is used in Schedule table
    private boolean checkReference(Long roomId) {
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (s.id) " +
                        "from Schedule s where s.room.id = :roomId")
                .setParameter("roomId", roomId)
                .getSingleResult();
        return count != 0;
    }

    @Override
    public List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Enter into getNotAvailableRooms with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {} ", semesterId, dayOfWeek, evenOdd, classId);
        if (evenOdd == EvenOdd.WEEKLY) {
            return sessionFactory.getCurrentSession().createQuery(

                    "select r1 from Room r1 " +
                            "where r1.id in " +
                            "(select r.id from Schedule s" +
                            " join s.room r " +
                            " where  s.semester.id = :semesterId " +
                            "and s.dayOfWeek = :dayOfWeek " +
                            "and s.period.id = :classId )")

                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .getResultList();
        } else {
            return sessionFactory.getCurrentSession().createQuery(

                    "select r1 from Room r1 " +
                            "where r1.id in " +
                            "(select r.id from Schedule s" +
                            " join s.room r " +
                            " where  s.semester.id = :semesterId " +
                            "and s.dayOfWeek = :dayOfWeek " +
                            "and s.period.id = :classId " +
                            "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY') )")

                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("evenOdd", evenOdd)
                    .getResultList();
        }
    }


    @Override
    public List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Enter into getAvailableRooms with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {} ", semesterId, dayOfWeek, evenOdd, classId);
        if (evenOdd == EvenOdd.WEEKLY) {
            return sessionFactory.getCurrentSession().createQuery(

                    "select r1 from Room r1 " +
                            "where r1.id not in " +
                            "(select r.id from Schedule s" +
                            " join s.room r " +
                            " where  s.semester.id = :semesterId " +
                            "and s.dayOfWeek = :dayOfWeek " +
                            "and s.period.id = :classId )")

                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .getResultList();
        } else {
            return sessionFactory.getCurrentSession().createQuery(

                    "select r1 from Room r1 " +
                            "where r1.id not in " +
                            "(select r.id from Schedule s" +
                            " join s.room r " +
                            " where  s.semester.id = :semesterId " +
                            "and s.dayOfWeek = :dayOfWeek " +
                            "and s.period.id = :classId " +
                            "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY') )")

                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek.toString())
                    .setParameter("classId", classId)
                    .setParameter("evenOdd", evenOdd)
                    .getResultList();
        }
    }
}
