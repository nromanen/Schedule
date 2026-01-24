package com.softserve.mapper;

import com.softserve.dto.StudentDTO;
import com.softserve.dto.StudentImportDTO;
import com.softserve.dto.StudentWithoutGroupDTO;
import com.softserve.entity.Student;
import com.softserve.entity.User;
import com.softserve.service.UserService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

/**
 * Mapper for converting between Student entity and various DTOs.
 */
@Mapper(componentModel = "spring", uses = GroupMapper.class)
public abstract class StudentMapper {
    @Autowired
    protected UserService userService;


    /**
     * Converts Student entity to StudentDTO.
     *
     * @param student the student entity to convert.
     * @return the converted StudentDTO.
     */
    @Mapping(target = "email", source = "user", qualifiedByName = "userToEmail")
    public abstract StudentDTO studentToStudentDTO(Student student);

    /**
     * Converts Student entity to StudentImportDTO.
     *
     * @param student the student entity to convert.
     * @return the converted StudentImportDTO.
     */
    @Mapping(target = "email", source = "user", qualifiedByName = "userToEmail")
    @Mapping(target = "groupDTO", source = "group")
    @Mapping(target = "importSaveStatus", ignore = true)
    public abstract StudentImportDTO studentToStudentImportDTO(Student student);

    /**
     * Converts StudentImportDTO to Student entity.
     *
     * @param studentImportDTO the DTO to convert.
     * @return the converted Student entity.
     */
    @Mapping(target = "user", source = "email", qualifiedByName = "emailToUser")
    @Mapping(target = "group", source = "groupDTO")
    public abstract Student studentImportDTOToStudent(StudentImportDTO studentImportDTO);

    /**
     * Converts StudentDTO to Student entity.
     *
     * @param studentDTO the DTO to convert.
     * @return the converted Student entity.
     */
    @Mapping(target = "user", source = "email", qualifiedByName = "emailToUser")
    public abstract Student studentDTOToStudent(StudentDTO studentDTO);

    /**
     * Converts Student entity to StudentWithoutGroupDTO.
     *
     * @param student the student entity to convert.
     * @return the converted StudentWithoutGroupDTO.
     */
    @Mapping(target = "email", source = "user", qualifiedByName = "userToEmail")
    public abstract StudentWithoutGroupDTO studentToStudentWithoutGroupDTO(Student student);

    /**
     * Converts StudentWithoutGroupDTO to Student entity.
     *
     * @param studentWithoutGroupDTO the DTO to convert.
     * @return the converted Student entity.
     */
    @Mapping(target = "user", source = "email", qualifiedByName = "emailToUser")
    @Mapping(target = "group", ignore = true)
    public abstract Student studentWithoutGroupDTOToStudent(StudentWithoutGroupDTO studentWithoutGroupDTO);

    /**
     * Converts list of Student entities to list of StudentDTOs.
     *
     * @param studentList the list of students to convert.
     * @return the list of converted StudentDTOs.
     */
    public abstract List<StudentDTO> convertToDTOList(List<Student> studentList);

    /**
     * Converts User entity to email string.
     *
     * @param user the user entity to convert.
     * @return the email string or null if user is null.
     */
    @Named("userToEmail")
    public String userToEmail(User user) {
        if (user != null) {
            return userService.getById(user.getId()).getEmail();
        }
        return null;
    }

    /**
     * Converts email string to User entity.
     *
     * @param email the email string to convert.
     * @return the User entity or null if not found.
     */
    @Named("emailToUser")
    public User emailToUser(String email) {
        if (email == null) {
            return null;
        }
        Optional<User> optionalUser = userService.findSocialUser(email);
        if (optionalUser.isPresent()) {
            return userService.findByEmail(email);
        }
        return null;
    }
}

