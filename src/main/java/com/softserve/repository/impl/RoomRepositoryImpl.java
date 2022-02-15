package com.softserve.repository.impl;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class RoomRepositoryImpl extends BasicRepositoryImpl<Room, Long> implements RoomRepository {

    private static final String GET_ALL_QUERY =
            "from Room order by name ASC";

    private static final String GET_ALL_QUERY_ORDERED =
            "from Room order by sortOrder ASC , name";

    private static final String CHECK_REFERENCE =
            "select count (s.id) " +
                    "from Schedule s where s.room.id = :roomId";

    private static final String GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE =
            "select r1 from Room r1 " +
                    "where r1.id in " +
                    "(select r.id from Schedule s" +
                    " join s.room r " +
                    " where  s.lesson.semester.id = :semesterId " +
                    "and s.dayOfWeek = :dayOfWeek " +
                    "and s.period.id = :classId )";

    private static final String GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE_2 =
            "select r1 from Room r1 " +
                    "where r1.id in " +
                    "(select r.id from Schedule s" +
                    " join s.room r " +
                    " where  s.lesson.semester.id = :semesterId " +
                    "and s.dayOfWeek = :dayOfWeek " +
                    "and s.period.id = :classId " +
                    "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY') )";

    private static final String GET_AVAILABLE_ROOMS_FOR_SCHEDULE =
            "select r1 from Room r1 " +
                    "where r1.id not in " +
                    "(select r.id from Schedule s" +
                    " join s.room r " +
                    " where  s.lesson.semester.id = :semesterId " +
                    "and s.dayOfWeek = :dayOfWeek " +
                    "and s.period.id = :classId )";

    private static final String GET_AVAILABLE_ROOMS_FOR_SCHEDULE_2 =
            "select r1 from Room r1 " +
                    "where r1.id not in " +
                    "(select r.id from Schedule s" +
                    " join s.room r " +
                    " where  s.lesson.semester.id = :semesterId " +
                    "and s.dayOfWeek = :dayOfWeek " +
                    "and s.period.id = :classId " +
                    "and ( s.evenOdd = :evenOdd or s.evenOdd = 'WEEKLY') )";

    private static final String COUNT_ROOM_DUPLICATES =
            "select count(*) from Room r " +
                    "where r.name = :name  and r.id != :id " +
                    "and r.type.id = :typeId ";

    private static final String GET_MAX_SORTING_ORDER =
            "SELECT max(r.sortOrder) FROM Room r";

    public static final String GET_NEXT_POSITION =
            "SELECT min(r.sortOrder) FROM Room r WHERE r.sortOrder > :position";

    private static final String GET_MIN_SORTING_ORDER =
            "SELECT min(r.sortOrder) FROM Room r";

    private static final String GET_AFTER_ID_SORT_ORDER =
            "select r.sortOrder from Room r where r.id = :afterId";

    private Session getSession() {
        Session session = sessionFactory.getCurrentSession();
        Filter filter = session.enableFilter("roomDisableFilter");
        filter.setParameter("disable", false);
        return session;
    }

    /**
     * The method used for getting list of entities from database
     *
     * @return list of entities
     */
    @Override
    public List<Room> getAll() {
        log.info("In getAll()");
        Session session = getSession();
        return session.createQuery(GET_ALL_QUERY, Room.class)
                .getResultList();
    }

    /**
     * The method used for getting list of free room by specific period, day of week and number of week from database
     *
     * @param idOfPeriod identity number of period
     * @param dayOfWeek  day of the week
     * @param evenOdd    number of week
     * @return list of rooms
     */
    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd) {
        log.info("Enter into freeRoomBySpecificPeriod of RoomRepositoryImpl with id {}, dayOfWeek {} and evenOdd {} ",
                idOfPeriod, dayOfWeek, evenOdd);
        Session session = getSession();
        Query<Room> query = session.createQuery
                        ("select r1 from " + basicClass.getName() + " r1" +
                                " where r1.id not in" +
                                "(select r.id from Schedule s" +
                                " join s.room r " +
                                " where  s.period.id = :idOfPeriod" +
                                " and s.dayOfWeek = :dayOfWeek" +
                                " and s.evenOdd = :evenOdd)", Room.class)
                .setParameter("idOfPeriod", idOfPeriod)
                .setParameter("dayOfWeek", dayOfWeek)
                .setParameter("evenOdd", evenOdd);
        return query.getResultList();
    }

    // Checking if room is used in Schedule table
    @Override
    protected boolean checkReference(Room room) {
        log.info("In checkReference(room = [{}])", room);
        Long count = (Long) sessionFactory.getCurrentSession().createQuery
                        (CHECK_REFERENCE)
                .setParameter("roomId", room.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Enter into getNotAvailableRooms with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {} ", semesterId, dayOfWeek, evenOdd, classId);
        Session session = getSession();
        if (evenOdd == EvenOdd.WEEKLY) {
            return session.createQuery(GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE, Room.class)
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .getResultList();
        } else {
            return session.createQuery(GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE_2, Room.class)
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .setParameter("evenOdd", evenOdd)
                    .getResultList();
        }
    }

    @Override
    public List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Enter into getAvailableRooms with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {} ", semesterId, dayOfWeek, evenOdd, classId);
        Session session = getSession();
        if (evenOdd == EvenOdd.WEEKLY) {
            return session.createQuery(GET_AVAILABLE_ROOMS_FOR_SCHEDULE, Room.class)
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .getResultList();
        } else {
            return session.createQuery(GET_AVAILABLE_ROOMS_FOR_SCHEDULE_2, Room.class)
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .setParameter("evenOdd", evenOdd)
                    .getResultList();
        }
    }

    @Override
    public Long countRoomDuplicates(Room room) {
        log.info("In countRoomDuplicates(room = [{}])", room);
        Session session = getSession();
        return (Long) session.createQuery(COUNT_ROOM_DUPLICATES)
                .setParameter("id", room.getId())
                .setParameter("name", room.getName())
                .setParameter("typeId", room.getType().getId())
                .getSingleResult();
    }

    /**
     * The method used for getting list of entities from database
     * @return list of entities ordered by sortOrder and title
     */
    @Override
    public List<Room> getAllOrdered() {
        log.info("In getAll()");
        Session session = getSession();
        return session.createQuery(GET_ALL_QUERY_ORDERED, Room.class)
                .getResultList();
    }

    /**
     * This method for getting max sort_order form database
     * @return max sorting order
     */
    @Override
    public Optional<Double> getMaxSortOrder() {
        return getSession().createQuery(GET_MAX_SORTING_ORDER, Double.class).uniqueResultOptional();
    }

    /**
     * This method for getting min sort_order form database
     * @return min sorting order
     */
    @Override
    public Optional<Double> getMinSortOrder() {
        return getSession().createQuery(GET_MIN_SORTING_ORDER, Double.class).uniqueResultOptional();
    }

    /**
     * This method for getting sorting order of the next element
     * @param position sorting order of the element
     * @return sorting order of the nex element
     */
    @Override
    public Optional<Double> getNextPosition(Double position) {
        return getSession().createQuery(GET_NEXT_POSITION, Double.class)
                .setParameter("position", position)
                .uniqueResultOptional();
    }

    /**
     * This method for retrieving sorting order by rooms id
     * @param afterId rooms id which sorting order needs to be retrieved
     * @return sorting order of the room
     */
    @Override
    public Optional<Double> getSortOrderAfterId(Long afterId) {
        return getSession().createQuery(GET_AFTER_ID_SORT_ORDER, Double.class)
                .setParameter("afterId", afterId)
                .uniqueResultOptional();
    }

}