package com.softserve.repository.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.User;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.IncorrectWishException;
import com.softserve.repository.TeacherWishesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

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





    private void validateTeacherWish(JsonNode teacherWish){
        try {
            teacherWish.forEach(jsonNode -> {
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
            });
        }catch (Exception e) {
            throw new IncorrectWishException("Wish is incorrect, "+ teacherWish.toString());
        }
    }



    private String checkTeacherClassWish(long teacher_id, Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId){

        return "q";
    }
}
