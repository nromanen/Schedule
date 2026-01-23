package com.softserve.repository.impl;

import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.RoomRepository;
import com.softserve.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class RoomRepositoryImpl extends BasicRepositoryImpl<Room, Long> implements RoomRepository {

    private static final String DISABLE_FILTER = " AND r1.disable = false";

    private static final String GET_ALL_QUERY =
            "SELECT r FROM Room r WHERE r.disable = false ORDER BY r.name ASC";

    private static final String CHECK_REFERENCE =
            "SELECT count(s.id) " +
                    "FROM Schedule s WHERE s.room.id = :roomId";

    private static final String GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE =
            "SELECT r1 FROM Room r1 " +
                    "WHERE r1.id IN " +
                    "(SELECT r.id FROM Schedule s " +
                    "JOIN s.room r " +
                    "WHERE s.lesson.semester.id = :semesterId " +
                    "AND s.dayOfWeek = :dayOfWeek " +
                    "AND s.period.id = :classId)" +
                    DISABLE_FILTER;

    private static final String GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE_2 =
            "SELECT r1 FROM Room r1 " +
                    "WHERE r1.id IN " +
                    "(SELECT r.id FROM Schedule s " +
                    "JOIN s.room r " +
                    "WHERE s.lesson.semester.id = :semesterId " +
                    "AND s.dayOfWeek = :dayOfWeek " +
                    "AND s.period.id = :classId " +
                    "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY'))" +
                    DISABLE_FILTER;

    private static final String GET_AVAILABLE_ROOMS_FOR_SCHEDULE =
            "SELECT r1 FROM Room r1 " +
                    "WHERE r1.disable = false AND r1.id NOT IN " +
                    "(SELECT r.id FROM Schedule s " +
                    "JOIN s.room r " +
                    "WHERE s.lesson.semester.id = :semesterId " +
                    "AND s.dayOfWeek = :dayOfWeek " +
                    "AND s.period.id = :classId)";

    private static final String GET_AVAILABLE_ROOMS_FOR_SCHEDULE_2 =
            "SELECT r1 FROM Room r1 " +
                    "WHERE r1.disable = false AND r1.id NOT IN " +
                    "(SELECT r.id FROM Schedule s " +
                    "JOIN s.room r " +
                    "WHERE s.lesson.semester.id = :semesterId " +
                    "AND s.dayOfWeek = :dayOfWeek " +
                    "AND s.period.id = :classId " +
                    "AND (s.evenOdd = :evenOdd OR s.evenOdd = 'WEEKLY'))";

    private static final String FREE_ROOM_BY_SPECIFIC_PERIOD =
            "SELECT r1 FROM Room r1 " +
                    "WHERE r1.disable = false AND r1.id NOT IN " +
                    "(SELECT r.id FROM Schedule s " +
                    "JOIN s.room r " +
                    "WHERE s.period.id = :idOfPeriod " +
                    "AND s.dayOfWeek = :dayOfWeek " +
                    "AND s.evenOdd = :evenOdd)";

    private static final String COUNT_ROOM_DUPLICATES =
            "SELECT count(r.id) FROM Room r " +
                    "WHERE r.name = :name AND r.id <> :id " +
                    "AND r.type.id = :typeId " +
                    "AND r.disable = false";

    private static final String IS_EXISTS_BY_ID =
            "SELECT 1 FROM Room r " +
                    "WHERE r.id = :id AND r.disable = false";

    private static final String GET_ALL_ORDERED =
            "SELECT r FROM Room r " +
                    "WHERE r.disable = false " +
                    "ORDER BY r.sortOrder ASC";

    private static final String MOVE_SORT_ORDER =
            "UPDATE Room r " +
                    "SET r.sortOrder = r.sortOrder + :offset " +
                    "WHERE r.sortOrder >= :lowerPosition";

    private static final String MOVE_SORT_ORDER_RANGE = MOVE_SORT_ORDER + " AND r.sortOrder <= :upperBound";

    private static final String GET_MAX_SORT_ORDER =
            "SELECT max(r.sortOrder) FROM Room r";

    @Override
    public List<Room> getAll() {
        log.info("In getAll()");
        return getSession()
                .createQuery(GET_ALL_QUERY, Room.class)
                .getResultList();
    }

    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd) {
        log.info("Enter into freeRoomBySpecificPeriod with id {}, dayOfWeek {} and evenOdd {}",
                idOfPeriod, dayOfWeek, evenOdd);
        return getSession()
                .createQuery(FREE_ROOM_BY_SPECIFIC_PERIOD, Room.class)
                .setParameter("idOfPeriod", idOfPeriod)
                .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                .setParameter(Constants.EVEN_ODD, evenOdd)
                .getResultList();
    }

    @Override
    protected boolean checkReference(Room room) {
        log.info("In checkReference(room = [{}])", room);
        Long count = getSession()
                .createQuery(CHECK_REFERENCE, Long.class)
                .setParameter(Constants.ROOM_ID, room.getId())
                .getSingleResult();
        return count != 0;
    }

    @Override
    public List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Enter into getNotAvailableRooms with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}",
                semesterId, dayOfWeek, evenOdd, classId);
        if (evenOdd == EvenOdd.WEEKLY) {
            return getSession()
                    .createQuery(GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE, Room.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .getResultList();
        } else {
            return getSession()
                    .createQuery(GET_NOT_AVAILABLE_ROOMS_FOR_SCHEDULE_2, Room.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .setParameter(Constants.EVEN_ODD, evenOdd)
                    .getResultList();
        }
    }

    @Override
    public List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        log.info("Enter into getAvailableRooms with semesterId = {}, dayOfWeek = {}, evenOdd = {}, classId = {}",
                semesterId, dayOfWeek, evenOdd, classId);
        if (evenOdd == EvenOdd.WEEKLY) {
            return getSession()
                    .createQuery(GET_AVAILABLE_ROOMS_FOR_SCHEDULE, Room.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .getResultList();
        } else {
            return getSession()
                    .createQuery(GET_AVAILABLE_ROOMS_FOR_SCHEDULE_2, Room.class)
                    .setParameter(Constants.SEMESTER_ID, semesterId)
                    .setParameter(Constants.DAY_OF_WEEK, dayOfWeek)
                    .setParameter(Constants.CLASS_ID, classId)
                    .setParameter(Constants.EVEN_ODD, evenOdd)
                    .getResultList();
        }
    }

    @Override
    public Long countRoomDuplicates(Room room) {
        log.info("In countRoomDuplicates(room = [{}])", room);
        return getSession()
                .createQuery(COUNT_ROOM_DUPLICATES, Long.class)
                .setParameter("id", room.getId())
                .setParameter("name", room.getName())
                .setParameter("typeId", room.getType().getId())
                .getSingleResult();
    }

    @Override
    public List<Room> getAllOrdered() {
        log.trace("In getAllOrdered()");
        return getSession()
                .createQuery(GET_ALL_ORDERED, Room.class)
                .getResultList();
    }

    @Override
    public boolean exists(Long id) {
        log.trace("In exists(id = [{}])", id);
        return getSession()
                .createQuery(IS_EXISTS_BY_ID, Integer.class)
                .setParameter("id", id)
                .uniqueResult() != null;
    }

    @Override
    public Optional<Integer> getLastSortOrder() {
        log.trace("Entered getLastSortOrder()");
        return getSession()
                .createQuery(GET_MAX_SORT_ORDER, Integer.class)
                .uniqueResultOptional();
    }

    @Override
    public void shiftSortOrderRange(Integer lowerBound, Integer upperBound, Direction direction) {
        log.trace("Entered into shiftSortOrderRange with lowerBound = {}, upperBound = {}, direction = {}",
                lowerBound, upperBound, direction);

        String hql = (upperBound != null) ? MOVE_SORT_ORDER_RANGE : MOVE_SORT_ORDER;
        var query = getSession().createMutationQuery(hql);

        query.setParameter("lowerPosition", lowerBound);
        query.setParameter("offset", direction == Direction.UP ? -1 : 1);

        if (upperBound != null) {
            query.setParameter("upperBound", upperBound);
        }

        int updated = query.executeUpdate();
        log.debug("Updated sortOrder of {} rooms", updated);
    }
}
