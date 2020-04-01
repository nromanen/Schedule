package com.softserve.repository.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.TeacherWishesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.time.DayOfWeek;


@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class TeacherWishesRepositoryImpl extends BasicRepositoryImpl<TeacherWishes, Long> implements TeacherWishesRepository {
    /**
     * Modified save method, which merge entity before updating it
     *
     * @param entity teacher wishes is going to be saved
     * @return Teacher Wishes
     */
    @Override
    public TeacherWishes save(TeacherWishes entity) {
        log.info("Enter into save method of {} with entity:{}", getClass().getName(), entity);
        entity = (TeacherWishes) sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().save(entity);
        return entity;
    }

    /**
     * Modified update method, which merge entity before updating it
     *
     * @param entity teacher wishes is going to be updated
     * @return Teacher Wishes
     */
    @Override
    public TeacherWishes update(TeacherWishes entity) {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), entity);
        entity = (TeacherWishes) sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().update(entity);
        return entity;
    }

    public void validateTeacherWish(JsonNode teacherWish){
        try {

            final JsonNode fstabSchema = loadResource("/wish-shema.json");
            final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();

            final JsonSchema schema = factory.getJsonSchema(fstabSchema);
            ProcessingReport report;
            report = schema.validate(teacherWish);
            System.out.println(report);



            /*teacherWish.forEach(jsonNode -> {
                int dayOfWeek = jsonNode.get("day_of_week").asInt();
                if(dayOfWeek == 0){
                    throw new IncorrectWishException("day_of_week is incorrect, "+jsonNode);
                }
                for (JsonNode classNode : jsonNode.get("wishes")) {
                    JsonNode classNumber = classNode.get("class_number");
                    if (classNumber.asInt() == 0) {
                        throw new IncorrectWishException("class_number is empty, "+ classNode);
                    }
                    JsonNode status = classNode.get("status");
                    if (status.asText() == null) {
                        throw new IncorrectWishException("status is empty, "+ classNode);
                    }
                }
            });*/
        }catch (Exception e) {
           // throw new IncorrectWishException("Wish is incorrect, "+ teacherWish.toString());
            e.printStackTrace();
        }
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

    private boolean isClassSuits(long teacher_id, Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId){

        return true;
    }
}
