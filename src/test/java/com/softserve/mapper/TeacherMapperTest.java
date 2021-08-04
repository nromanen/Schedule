package com.softserve.mapper;

import com.softserve.dto.TeacherDTO;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class TeacherMapperTest {

    @Test
    public void teacherDTOToTeacherForSiteTest() {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(1L);
        teacherDTO.setSurname("Harrison");
        teacherDTO.setName("Ford");
        teacherDTO.setPatronymic("Edward");
        teacherDTO.setPosition("Doctor of Science");
        String expectedTeacherForSite = "Doctor of Science Harrison F. E.";

        String result = TeacherMapper.teacherDTOToTeacherForSite(teacherDTO);

        Assert.assertEquals(expectedTeacherForSite, result);
    }

}
