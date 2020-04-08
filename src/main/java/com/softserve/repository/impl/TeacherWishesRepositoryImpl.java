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
     * @param teacherWish
     * @throws IncorrectWishException when json not valid
     */
    public void validateTeacherWish(JsonNode teacherWish) {
        try {
            final JsonNode fstabSchema = loadResource("/wish-schema.json");
            final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();
            final JsonSchema schema = factory.getJsonSchema(fstabSchema);
            ProcessingReport report = schema.validate(teacherWish);
            if (!report.isSuccess()) {
                throw new IncorrectWishException("Wish is incorrect, " + report.toString());
            }
                ObjectMapper objectMapper = new ObjectMapper();
                Wishes[] wishes = objectMapper.readValue(teacherWish.toString(), Wishes[].class);

                for(Wishes wishItem :wishes){
                    if(!isUniqueClassId(wishItem.getWishes())){
                        throw new IncorrectWishException("wishes is incorrect");
                    }
                }
        } catch (ProcessingException | IOException e) {
            log.error("Error in method validateTeacherWish {}",e.toString());
            throw new IncorrectWishException("Error occured when validating teacher wishes");
        }
    }

    /**
     * isClassSuits method
     *
     * @param teacherId, dayOfWeek, evenOdd, classId
     * @return boolean
     */
    public boolean isClassSuits(Long teacherId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        JsonNode teacherWish = (JsonNode) sessionFactory.getCurrentSession().createQuery("" +
                "select t.wishList from TeacherWishes t " +
                "where t.teacher.id = :teacherId")
                .setParameter("teacherId", teacherId)
                .getSingleResult();


        /*ObjectMapper objectMapper = new ObjectMapper();
        try {
            Wishes[] wishes = objectMapper.readValue(teacherWish.toString(), Wishes[].class);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }*/

        for (JsonNode jsonNode : teacherWish) {
            if((DayOfWeek.valueOf(jsonNode.get("day_of_week").asText()) == dayOfWeek) &&
                    (EvenOdd.valueOf(jsonNode.get("evenOdd").asText()) == evenOdd)){
                for (JsonNode classNode : jsonNode.get("wishes")) {
                    if(classNode.get("class_id").asInt() == classId){
                       return !(classNode.get("status").asText().equals("Not good"));
                    }
                }
            }
        }
        return true;
    }

    public boolean isUniqueClassId(List<Wish> wishesList) {
        return wishesList.stream().map(Wish::getClassId).distinct().count() == wishesList.size();
    }

}
