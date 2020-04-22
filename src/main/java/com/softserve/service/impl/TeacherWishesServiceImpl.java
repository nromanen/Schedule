package com.softserve.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.Wish;
import com.softserve.entity.Wishes;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.entity.enums.WishStatuses;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.IncorrectWishException;
import com.softserve.repository.TeacherWishesRepository;
import com.softserve.service.PeriodService;
import com.softserve.service.TeacherWishesService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
public class TeacherWishesServiceImpl implements TeacherWishesService {

    private final TeacherWishesRepository teacherWishesRepository;
    private PeriodService periodService;

    @Autowired
    public TeacherWishesServiceImpl(TeacherWishesRepository teacherWishesRepository, PeriodService periodService) {
        this.teacherWishesRepository = teacherWishesRepository;
        this.periodService = periodService;
    }

    /**
     * The method used for getting wish by id
     *
     * @param id Identity wish id
     * @return target wish
     * @throws EntityNotFoundException if wish doesn't exist
     */
    @Override
    public TeacherWishes getById(Long id) {
        log.info("Enter into getById of TeacherWishesServiceImpl with id {}", id);
        return teacherWishesRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(TeacherWishes.class, "id", id.toString()));
    }

    /**
     * Method gets all wishes
     *
     * @return List of all wishes
     */
    @Override
    public List<TeacherWishes> getAll() {
        List<TeacherWishes> teacherWishesList = teacherWishesRepository.getAll();
        teacherWishesList.forEach(wish -> Hibernate.initialize(wish.getTeacher()));
        return teacherWishesList;
    }

    @Override
    public TeacherWishes save(TeacherWishes object) {
        log.info("Enter into save method with entity:{}", object);
        if (teacherWishesRepository.countWishesByTeacherId(object.getTeacher().getId()) > 0) {
            throw new EntityAlreadyExistsException("Wish already created");
        }
        validateTeacherWish(object.getTeacherWishesList());
        return teacherWishesRepository.save(object);
    }

    /**
     * Method updates information for an existing wish in Repository
     *
     * @param object Wish entity with info to be updated
     * @return updated Wish entity
     */
    @Override
    public TeacherWishes update(TeacherWishes object) {
        log.info("Enter into update method with entity:{}", object);
        validateTeacherWish(object.getTeacherWishesList());
        return teacherWishesRepository.update(object);
    }

    /**
     * Method deletes an existing wish from Repository
     *
     * @param object Wish entity to be deleted
     * @return deleted Wish entity
     */

    @Override
    public TeacherWishes delete(TeacherWishes object) {
        log.info("Enter into delete method with entity:{}", object);
        return teacherWishesRepository.delete(object);
    }

    /**
     * Method validate if a class is comfortable for teacher
     *
     * @param teacherId, dayOfWeek, evenOdd, classId
     * @return boolean teacher wish
     */
    @Override
    public boolean isClassSuits(Long teacherId, DayOfWeek dayOfWeek, EvenOdd evenOdd, long classId) {
        log.info("Enter into isClassSuits method");
        List<Wishes> teacherWishList = teacherWishesRepository.getWishByTeacherId(teacherId);
        String className = periodService.getById(classId).getName();

        return teacherWishList.stream().filter(wishItem -> DayOfWeek.valueOf(wishItem.getDayOfWeek()) == dayOfWeek
                && (EvenOdd.valueOf(wishItem.getEvenOdd()) == evenOdd))
                .noneMatch(wishItem -> wishItem.getWishes().stream().anyMatch(classItem -> classItem.getClassName().equals(className)
                        && classItem.getStatus().equals(WishStatuses.BAD.toString())));

    }

    /**
     * Load one resource from the current package as a {@link JsonNode}
     *
     * @param name name of the resource (<b>MUST</b> start with {@code /}
     * @return a JSON document
     * @throws IOException resource not found
     */
    public static JsonNode loadResource(final String name)
            throws IOException {
        return JsonLoader.fromResource(name);
    }


    /**
     * Validate method
     *
     * @param teacherWishes
     * @throws IncorrectWishException when json not valid
     */
    public void validateTeacherWish(Wishes[] teacherWishes) {
        log.info("Enter validateTeacherWish method ");

        List<Wishes> teacherWishesList = Arrays.asList(teacherWishes);
        isTeacherSchemaValid(teacherWishes);
        if (!isUniqueDayAndEvenOdd(teacherWishesList)) {
            throw new IncorrectWishException("wish is not unique");
        }
        for (Wishes wishItem : teacherWishesList) {
            if (!isUniqueClassName(wishItem.getWishes())) {
                throw new IncorrectWishException("classes is not unique");
            }
            if (EvenOdd.valueOf(wishItem.getEvenOdd()).equals(EvenOdd.WEEKLY) && !isEvenOddNotExist(wishItem, teacherWishesList)) {
                throw new IncorrectWishException("EVEN and ODD is not allowed together with WEEKLY");
            }
        }
    }

    /**
     * Method check if class is unique
     *
     * @param wishesList
     * return true if class unique
     */
    public boolean isUniqueClassName(List<Wish> wishesList) {
        log.info("Enter isUniqueClassName update method with wishesList:{}", wishesList);
        return wishesList.stream().map(Wish::getClassName).distinct().count() == wishesList.size();
    }


    public boolean isEvenOddNotExist(Wishes wishes, List<Wishes> wishesList) {
        log.info("Enter isEvenOddNotExist update method with wishesList:{}", wishesList);
        return wishesList.stream().noneMatch(wish ->
                wish.getDayOfWeek().equals(wishes.getDayOfWeek()) && (EvenOdd.valueOf(wish.getEvenOdd()).equals(EvenOdd.EVEN)
                        || EvenOdd.valueOf(wish.getEvenOdd().toUpperCase()).equals(EvenOdd.ODD))
        );
    }

    /**
     * Method check if pairs day and evenOdd  is unique
     *
     * @param wishesList
     * return true if pairs day and evenOdd  is unique
     */
    public boolean isUniqueDayAndEvenOdd(List<Wishes> wishesList) {
        log.info("Enter isUniqueDayAndEvenOdd method with wishesList:{}", wishesList);
        return wishesList.stream().filter(distinctByKeys(Wishes::getDayOfWeek, Wishes::getEvenOdd)).count() == wishesList.size();
    }

    /**
     * Validate method
     *
     * @param teacherWishes
     * @throws IncorrectWishException when json is not valid
     */
    @Override
    public void isTeacherSchemaValid(Wishes[] teacherWishes) {
        log.info("Enter isTeacherSchemaValid method");
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode teacherWishNode = mapper.convertValue(teacherWishes, JsonNode.class);
            final JsonNode fstabSchema = loadResource("/wish-schema.json");
            final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();
            final JsonSchema schema = factory.getJsonSchema(fstabSchema);
            ProcessingReport report = schema.validate(teacherWishNode);
            if (!report.isSuccess()) {
                throw new IncorrectWishException("Wish is incorrect, " + report.toString());
            }
        } catch (ProcessingException | IOException e) {
            log.error("Error in method validateTeacherWish {}", e.toString());
            throw new IncorrectWishException("Error occurred when validating teacher wishes");
        }
    }


    @SafeVarargs
    private static <T> Predicate<T> distinctByKeys(Function<? super T, ?>... keyExtractors) {
        final Map<List<?>, Boolean> seen = new ConcurrentHashMap<>();
        return t ->
        {
            final List<?> keys = Arrays.stream(keyExtractors)
                    .map(ke -> ke.apply(t))
                    .collect(Collectors.toList());

            return seen.putIfAbsent(keys, Boolean.TRUE) == null;
        };
    }
}
