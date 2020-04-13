package com.softserve.repository.impl;

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
import com.softserve.exception.IncorrectWishException;
import com.softserve.repository.TeacherWishesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import java.io.IOException;
import java.time.DayOfWeek;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class TeacherWishesRepositoryImpl extends BasicRepositoryImpl<TeacherWishes, Long> implements TeacherWishesRepository {

    /**
     * Modified update method, which merge entity before updating it
     *
     * @param entity teacher wishes is going to be updated
     * @return Teacher Wishes
     */
    @Override
    public TeacherWishes save(TeacherWishes entity) {
        log.info("Enter into save method  with entity:{}", entity);
        entity = (TeacherWishes)sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().save(entity);
        return entity;
    }

    /**
     * Method verifies if Subject with id param exist in repository
     * @param teacherId teacher id
     * @return true if Subject with id param exist
     */
    @Override
    public Long isExistsWishWithTeacherId(Long teacherId) {
        log.info("Enter into isExistsWishWithTeacherId method with teacherId: {}",  teacherId);
        return (Long) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM TeacherWishes t WHERE t.teacher.id = :teacherId")
                .setParameter("teacherId", teacherId).getSingleResult();
    }

    /**
     * Load one resource from the current package as a {@link JsonNode}
     *
     * @param name name of the resource (<b>MUST</b> start with {@code /}
     * @return a JSON document
     * @throws IOException resource not found
     */
    public static JsonNode loadResource(final String name)
            throws IOException
    {
        return JsonLoader.fromResource(name);
    }


    /**
     * Validate method
     *
     * @param teacherWishes
     * @throws IncorrectWishException when json not valid
     */
    public void validateTeacherWish(Wishes[] teacherWishes) {
        List<Wishes> teacherWishesList = Arrays.asList(teacherWishes);
        isTeacherSchemaValid(teacherWishes);
        if (!isUniqueDayAndEven(teacherWishesList)) {
            throw new IncorrectWishException("wish is not unique");
        }

        for (Wishes wishItem : teacherWishesList) {
            if (!isUniqueClassId(wishItem.getWishes())) {
                throw new IncorrectWishException("classes is not unique");
            }
            if(EvenOdd.valueOf(wishItem.getEvenOdd()).equals(EvenOdd.WEEKLY) && !isEvenOddNotExist(wishItem, teacherWishesList)){
                throw new IncorrectWishException("EVEN and ODD is not allowed together with WEEKLY");
            }
        }
    }


    public boolean isUniqueClassId(List<Wish> wishesList) {
        return wishesList.stream().map(Wish::getClassId).distinct().count() == wishesList.size();
    }
    public boolean isEvenOddNotExist(Wishes wishes, List<Wishes> wishesList) {
        return wishesList.stream().noneMatch(wish ->
                wish.getDayOfWeek().equals(wishes.getDayOfWeek()) && (EvenOdd.valueOf(wish.getEvenOdd()).equals(EvenOdd.EVEN)
                        ||  EvenOdd.valueOf(wish.getEvenOdd()).equals(EvenOdd.ODD))
        );
    }

    public boolean isUniqueDayAndEven(List<Wishes> wishesList) {
        return wishesList.stream().filter(distinctByKeys(Wishes::getDayOfWeek, Wishes::getEvenOdd)).count() == wishesList.size();
    }

    /**
     * getWishByTeacherId method
     *
     * @param teacherId
     * @return Wishes
     */
    public Wishes[] getWishByTeacherId(Long teacherId) {
        return  (Wishes[]) sessionFactory.getCurrentSession().createQuery("" +
                "select t.teacherWishesList from TeacherWishes t " +
                "where t.teacher.id = :teacherId")
                .setParameter("teacherId", teacherId)
                .getSingleResult();
    }


    @Override
    public void isTeacherSchemaValid(Wishes[] teacherWish) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode teacherWishNode = mapper.convertValue(teacherWish, JsonNode.class);
            final JsonNode fstabSchema = loadResource("/wish-schema.json");
            final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();
            final JsonSchema schema = factory.getJsonSchema(fstabSchema);
            ProcessingReport report = schema.validate(teacherWishNode);
            if (!report.isSuccess()) {
                throw new IncorrectWishException("Wish is incorrect, " + report.toString());
            }
        } catch (ProcessingException | IOException e) {
            log.error("Error in method validateTeacherWish {}",e.toString());
            throw new IncorrectWishException("Error occured when validating teacher wishes");
        }
    }


    private static <T> Predicate<T> distinctByKeys(Function<? super T, ?>... keyExtractors)
    {
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
