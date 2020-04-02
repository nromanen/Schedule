package com.softserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softserve.config.DBConfigTest;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.dto.GroupDTO;
import com.softserve.dto.LessonInfoDTO;
import com.softserve.dto.SubjectDTO;
import com.softserve.dto.TeacherDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Subject;
import com.softserve.entity.Teacher;
import com.softserve.entity.enums.LessonType;
import com.softserve.service.GroupService;
import com.softserve.service.LessonService;
import com.softserve.service.SubjectService;
import com.softserve.service.TeacherService;
import com.softserve.service.mapper.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfigTest.class, MyWebAppInitializer.class})
@WebAppConfiguration
public class LessonsControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Lesson lesson = new Lesson();
    private LessonInfoDTO lessonDtoForBefore;
    private Subject subject;
    private Teacher teacher;
    private Group group;


    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private GroupService groupService;


    @Before
    public void insertData() {

        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setName("Ivan");
        teacherDTO.setSurname("Ivanov");
        teacherDTO.setPatronymic("Ivanovych");
        teacherDTO.setPosition("Docent");
        teacher = teacherService.save(new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO));

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("History");
        subject = subjectService.save(new SubjectMapperImpl().subjectDTOToSubject(subjectDTO));

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle("111");
        group = groupService.save(new GroupMapperImpl().groupDTOToGroup(groupDTO));

        lessonDtoForBefore = new LessonInfoDTO();
        lessonDtoForBefore.setHours(1);
        lessonDtoForBefore.setTeacherForSite("Ivanov I.I.");
        lessonDtoForBefore.setSubjectForSite("History of UA");
        lessonDtoForBefore.setLessonType(LessonType.LECTURE);
        lessonDtoForBefore.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonDtoForBefore.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonDtoForBefore.setGroup(new GroupMapperImpl().groupToGroupDTO(group));
        lesson = new LessonInfoMapperImpl().lessonInfoDTOToLesson(lessonDtoForBefore);

        lessonService.save(lesson);


    }

    @After
    public void deleteData() {
        lessonService.delete(lesson);
        groupService.delete(group);
        teacherService.delete(teacher);
        subjectService.delete(subject);
        lessonDtoForBefore = null;
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(get("/lessons").accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGet() throws Exception {

        mockMvc.perform(get("/lessons/{id}", String.valueOf(lesson.getId())).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(String.valueOf(lesson.getId())));
    }

    @Test
    public void testSave() throws Exception {
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setName("Petro");
        teacherDTO.setSurname("Petrov");
        teacherDTO.setPatronymic("Petrovych");
        teacherDTO.setPosition("Docent");
        teacher = teacherService.save(new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO));

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("Biology");
        subject = subjectService.save(new SubjectMapperImpl().subjectDTOToSubject(subjectDTO));

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle("222");
        group = groupService.save(new GroupMapperImpl().groupDTOToGroup(groupDTO));

        LessonInfoDTO lessonDtoForSave = new LessonInfoDTO();
        lessonDtoForSave.setHours(1);
        lessonDtoForSave.setTeacherForSite("Petrov P.P. for save");
        lessonDtoForSave.setSubjectForSite("Biology for save");
        lessonDtoForSave.setLessonType(LessonType.LABORATORY);
        lessonDtoForSave.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonDtoForSave.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonDtoForSave.setGroup(new GroupMapperImpl().groupToGroupDTO(group));

        mockMvc.perform(post("/lessons").content(objectMapper.writeValueAsString(lessonDtoForSave))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdate() throws Exception {
        LessonInfoDTO lessonDtoForUpdate = new LessonInfoDTO();
        lessonDtoForUpdate.setId(lesson.getId());
        lessonDtoForUpdate.setHours(1);
        lessonDtoForUpdate.setTeacherForSite("Ivanov I.I. for update");
        lessonDtoForUpdate.setSubjectForSite("History of UA for update");
        lessonDtoForUpdate.setLessonType(LessonType.PRACTICAL);
        lessonDtoForUpdate.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonDtoForUpdate.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonDtoForUpdate.setGroup(new GroupMapperImpl().groupToGroupDTO(group));

        Lesson lessonForCompare = new LessonInfoMapperImpl().lessonInfoDTOToLesson(lessonDtoForUpdate);

        mockMvc.perform(put("/lessons", String.valueOf(lesson.getId())).content(objectMapper.writeValueAsString(lessonDtoForUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(lessonForCompare.getId()))
                .andExpect(jsonPath("$.hours").value(lessonForCompare.getHours()))
                .andExpect(jsonPath("$.teacherForSite").value(lessonForCompare.getTeacherForSite()))
                .andExpect(jsonPath("$.subjectForSite").value(lessonForCompare.getSubjectForSite()))
                .andExpect(jsonPath("$.lessonType").value(lessonForCompare.getLessonType()))
                .andExpect(jsonPath("$.subject").value(lessonForCompare.getSubject()))
                .andExpect(jsonPath("$.group").value(lessonForCompare.getGroup()))
                .andExpect(jsonPath("$.teacher").value(lessonForCompare.getTeacher()));
    }

    @Test
    public void testDelete() throws Exception {
        LessonInfoDTO lessonInfoDTO = new LessonInfoDTO();
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setName("Ivan for delete");
        teacherDTO.setSurname("Ivanov for delete");
        teacherDTO.setPatronymic("Ivanovych for delete");
        teacherDTO.setPosition("Docent for delete");
        Teacher teacher = teacherService.save(new TeacherMapperImpl().teacherDTOToTeacher(teacherDTO));

        SubjectDTO subjectDTO = new SubjectDTO();
        subjectDTO.setName("subject for delete");
        Subject subject = subjectService.save(new SubjectMapperImpl().subjectDTOToSubject(subjectDTO));

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setTitle("group for delete");
        Group group = groupService.save(new GroupMapperImpl().groupDTOToGroup(groupDTO));

        lessonInfoDTO.setHours(1);
        lessonInfoDTO.setTeacherForSite("Ivanov I.I. for delete");
        lessonInfoDTO.setSubjectForSite("History of UA delete");
        lessonInfoDTO.setLessonType(LessonType.LECTURE);
        lessonInfoDTO.setTeacher(new TeacherNameMapperImpl().teacherNameToTeacherDTO(teacher));
        lessonInfoDTO.setSubject(new SubjectMapperImpl().subjectToSubjectDTO(subject));
        lessonInfoDTO.setGroup(new GroupMapperImpl().groupToGroupDTO(group));
        lesson = new LessonInfoMapperImpl().lessonInfoDTOToLesson(lessonInfoDTO);
        lessonService.save(lesson);

        mockMvc.perform(delete("/lessons/{id}", String.valueOf(lesson.getId()))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
        teacherService.delete(teacher);
        subjectService.delete(subject);
        groupService.delete(group);
    }
}
