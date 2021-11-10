package com.softserve.repository.impl;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.time.DayOfWeek;
import java.util.ArrayList;
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
        return session.createQuery(GET_ALL_QUERY)
                .getResultList();
    }

    /**
     * The method used for getting list of entities from database
     *
     * @return list of entities ordered by sortOrder and title
     */
    @Override
    public List<Room> getAllOrdered() {
        log.info("In getAll()");
        Session session = getSession();
        return session.createQuery(GET_ALL_QUERY_ORDERED)
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

    // Checking if room is used in Schedule table
    @Override
    protected boolean checkReference(Room room) {
        log.info("In checkReference(room = [{}])", room);
        long count = (long) sessionFactory.getCurrentSession().createQuery
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
            return session.createQuery(GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE)
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .getResultList();
        } else {
            return session.createQuery(GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE_2)
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
            return session.createQuery(GET_AVAILABLE_ROOMS_FOR_SCHEDULE)
                    .setParameter("semesterId", semesterId)
                    .setParameter("dayOfWeek", dayOfWeek)
                    .setParameter("classId", classId)
                    .getResultList();
        } else {
            return session.createQuery(GET_AVAILABLE_ROOMS_FOR_SCHEDULE_2)
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
     * The method is used to save room after the specific room to get desired order
     *
     * @param room    the room that must be saved
     * @param afterId the id of the room after which must be saved the new one
     *                if we want to insert into first position we set afterId = 0
     * @return saved room with set order and id
     */
    @Override
    public Room saveRoomAfterId(Room room, Long afterId) {
        log.info("Enter saveRoomAfterId");
        Optional<Room> previousRoom = findById(afterId);

        Double maxOrder = Optional.ofNullable(
                getSession().createQuery(GET_MAX_SORTING_ORDER, Double.class).getSingleResult()).orElse(0.0);

        Double minOrder = Optional.ofNullable(getSession().createQuery(GET_MIN_SORTING_ORDER, Double.class)
                .getSingleResult()).orElse(2.0);

        if (previousRoom.isPresent()) {
            Double previousPosition = Optional.ofNullable(previousRoom.get().getSortOrder()).orElse(0.0);

            TypedQuery<Double> doubleTypedQuery = getSession().createQuery(GET_NEXT_POSITION, Double.class);

            doubleTypedQuery.setParameter("position", previousPosition);
            Double nextPosition = Optional.ofNullable(
                    doubleTypedQuery.getSingleResult()).orElse(previousPosition + 2);

            Double newPosition = ((nextPosition + previousPosition) / 2);
            if (newPosition - 1 < 0.01) {
                newPosition = Optional.ofNullable(getSession().createQuery(GET_MAX_SORTING_ORDER, Double.class)
                                .getSingleResult()).orElse(0.0) + 1;
            }
            room.setSortOrder(newPosition);
        } else if (afterId == 0) {
            room.setSortOrder(minOrder / 2);
        } else {
            room.setSortOrder(maxOrder + 1);
        }
        save(room);
        return room;
    }

    /**
     * Method updates room order position
     *
     * @param room    room that will be replaced
     * @param afterId id of the room after which will be placed
     *                if we want to update room to first position we set afterId = 0
     * @return room with new position
     */
    @Override
    public Room updateRoomAfterId(Room room, Long afterId) {
        log.info("Enter updateRoomAfterId: {}{}", room, afterId);

        if (afterId == room.getId()) {

            TypedQuery<Double> sortOrderTypedQuery = getSession().createQuery(GET_AFTER_ID_SORT_ORDER, Double.class);
            sortOrderTypedQuery.setParameter("afterId", afterId);

            Double myOrder = Optional.ofNullable(sortOrderTypedQuery.getSingleResult()).orElse(0.0);

            room.setSortOrder(myOrder);
        } else {
            Optional<Room> previousRoom = findById(afterId);

            Double minOrder = Optional.ofNullable(
                    getSession().createQuery(GET_MIN_SORTING_ORDER, Double.class)
                            .getSingleResult()).orElse(0.0);

            if (previousRoom.isPresent()) {
                Double previousPosition = Optional.ofNullable(previousRoom.get().getSortOrder()).orElse(0.0);

                TypedQuery<Double> doubleTypedQuery = getSession().createQuery(GET_NEXT_POSITION, Double.class);
                doubleTypedQuery.setParameter("position", previousPosition);

                Double nextPosition = Optional.ofNullable(doubleTypedQuery.
                        getSingleResult()).orElse(previousPosition + 2);
                Double newPosition = ((nextPosition + previousPosition) / 2);

                if (newPosition - 1 < 0.01) {
                    newPosition = Optional.ofNullable(getSession().createQuery(GET_MAX_SORTING_ORDER, Double.class)
                            .getSingleResult()).orElse(0.0) + 1;
                }
                room.setSortOrder(newPosition);

            } else if (afterId == 0) {
                room.setSortOrder(minOrder / 2);
            } else {
                room.setSortOrder(1.0);
            }
        }
        update(room);
        return room;
    }

}