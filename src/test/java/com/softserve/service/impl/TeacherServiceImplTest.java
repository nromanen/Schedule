package com.softserve.service.impl;

import com.softserve.config.DBConfig;
import com.softserve.config.MyWebAppInitializer;
import com.softserve.config.WebMvcConfig;
import com.softserve.entity.Teacher;
import com.softserve.repository.TeacherRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {WebMvcConfig.class, DBConfig.class, MyWebAppInitializer.class})
@WebAppConfiguration
@FixMethodOrder
public class TeacherServiceImplTest {

    @Mock
    TeacherRepository teacherRepository;

    @InjectMocks
    TeacherServiceImpl teacherService;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSave() {
        Teacher teacher = new Teacher();
        teacher.setName("1name1");
        teacher.setSurname("1surname1");
        teacher.setPatronymic("1patronymic1");
        teacher.setPosition("1position1");
        teacher.setUserId(11);
        teacher.setId(1);

        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacher);
        Teacher created = teacherService.save(teacher);

        Assert.assertSame(teacher, created);
    }
}
