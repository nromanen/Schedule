package com.softserve.mapper;

import com.softserve.dto.TeacherForUpdateDTO;
import org.apache.commons.lang3.StringUtils;
import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherWithUserDTO;
import com.softserve.dto.TeacherWishDTO;
import com.softserve.dto.UserDataDTO;
import com.softserve.entity.Teacher;
import com.softserve.service.UserService;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.MapperConfig;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Mapper(componentModel = "spring")
@MapperConfig(uses = {DepartmentMapper.class})
public abstract class TeacherMapper {
    @Autowired
    protected UserService userService;

    @InheritInverseConfiguration
    @Mapping(target = "email", source = "userId", qualifiedByName = "userIdToEmail")
    public abstract TeacherDTO teacherToTeacherDTO(Teacher teacher);

    public String userIdToEmail(Integer userId) {
        if(userId != null) {
            return userService.getById(userId.longValue()).getEmail();
        }
        return null;
    }

    @Mapping(target = "department", source = "departmentDTO")
    public abstract Teacher teacherDTOToTeacher(TeacherDTO teacherDTO);

    public abstract TeacherForUpdateDTO teacherToTeacherForUpdateDTO(Teacher teacher);

    public abstract Teacher teacherForUpdateDTOToTeacher(TeacherForUpdateDTO teacherForUpdateDTO);

    public abstract TeacherWithUserDTO toTeacherWithUserDTO(Teacher teacher);

    public abstract TeacherWishDTO toTeacherWithWishesDTOs(Teacher teacher);

    @Mapping(target = "teacherId", source = "id")
    @Mapping(target = "teacherName", source = "name")
    @Mapping(target = "teacherSurname", source = "surname")
    @Mapping(target = "teacherPatronymic", source = "patronymic")
    @Mapping(target = "teacherPosition", source = "position")
    @Mapping(target = "teacherDepartmentDTO", source = "department")
    public abstract UserDataDTO teacherToUserDataDTO(Teacher teacher);

    public abstract List<TeacherWishDTO> toTeacherWithWishesDTOs(List<Teacher> teachers);

    public abstract List<TeacherDTO> teachersToTeacherDTOs(List<Teacher> teachers);

    public static String teacherDTOToTeacherForSite(TeacherDTO teacherDTO) {
        return StringUtils.join(
                teacherDTO.getPosition()
                , " "
                , teacherDTO.getSurname()
                , " "
                , teacherDTO.getName().charAt(0)
                , ". "
                , teacherDTO.getPatronymic().charAt(0)
                , "."
        );
    }
}
