package com.softserve.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.softserve.entity.TeacherWishes;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.IncorrectWishException;
import com.softserve.repository.TeacherWishesRepository;
import com.softserve.service.TeacherWishesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Transactional
@Service
@Slf4j
public class TeacherWishesServiceImpl implements TeacherWishesService {

    private final TeacherWishesRepository teacherWishesRepository;

    @Autowired
    public TeacherWishesServiceImpl(TeacherWishesRepository teacherWishesRepository) {
        this.teacherWishesRepository = teacherWishesRepository;
    }

    /**
     * The method used for getting teacher by id
     *
     * @param id Identity teacher id
     * @return target teacher
     * @throws EntityNotFoundException if teacher doesn't exist
     */
    @Override
    public TeacherWishes getById(Long id) {
        log.info("Enter into getById of TeacherServiceImpl with id {}", id);
        return teacherWishesRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(TeacherWishes.class, "id", id.toString()));
    }

    /**
     * Method gets information about teachers from Repository
     * @return List of all teachers
     */
    @Override
    public List<TeacherWishes> getAll() {
        return teacherWishesRepository.getAll();
    }

    @Override
    public TeacherWishes save(TeacherWishes object) {
        log.info("Enter into save method of {} with entity:{}", getClass().getName(), object);
        validateTeacherWish(object.getWishList());
        return teacherWishesRepository.save(object);
    }

    /**
     * Method updates information for an existing teacher in Repository
     * @param object Teacher entity with info to be updated
     * @return updated Teacher entity
     */
    @Override
    public TeacherWishes update(TeacherWishes object)
    {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), object);
        validateTeacherWish(object.getWishList());
        return teacherWishesRepository.update(object);
    }

    /**
     * Method deletes an existing teacher from Repository
     * @param object Teacher entity to be deleted
     * @return deleted Teacher entity
     */
    @Override
    public TeacherWishes delete(TeacherWishes object) {
        log.info("Enter into delete method of {} with entity:{}", getClass().getName(), object);
        return teacherWishesRepository.delete(object);
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
}
