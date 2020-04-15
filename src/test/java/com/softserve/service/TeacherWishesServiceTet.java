package com.softserve.service;

import com.softserve.entity.Teacher;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.Wish;
import com.softserve.entity.Wishes;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.IncorrectWishException;
import com.softserve.repository.TeacherWishesRepository;
import com.softserve.service.impl.TeacherWishesServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class TeacherWishesServiceTet {

    @Mock
    private TeacherWishesRepository teacherWishesRepository;

    @InjectMocks
    private TeacherWishesServiceImpl teacherWishesService;

    @Test
    public void testGetById() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("EVEN");
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);

        when(teacherWishesRepository.findById(1L)).thenReturn(Optional.of(teacherWishes));

        TeacherWishes result = teacherWishesService.getById(1L);
        assertNotNull(result);
        assertEquals(teacherWishes.getId(), result.getId());
        verify(teacherWishesRepository, times(1)).findById(anyLong());
    }

    @Test(expected = EntityNotFoundException.class)
    public void notFoundId() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("EVEN");
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);

        teacherWishesService.getById(2L);
        verify(teacherWishesRepository, times(1)).findById(2L);
    }

    @Test
    public void testSave() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("EVEN");
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);

        when(teacherWishesRepository.countWishesByTeacherId(teacher.getId())).thenReturn(0L);
        when(teacherWishesRepository.save(teacherWishes)).thenReturn(teacherWishes);

        TeacherWishes result = teacherWishesService.save(teacherWishes);
        assertNotNull(result);
        assertEquals(teacherWishes.getId(), result.getId());
        assertEquals(teacherWishes.getTeacher(), result.getTeacher());
        verify(teacherWishesRepository, times(1)).save(teacherWishes);
        verify(teacherWishesRepository, times(1)).countWishesByTeacherId(1L);
    }

    @Test(expected = EntityAlreadyExistsException.class)
    public void saveWhenTeacherIsExists() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("EVEN");
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);

        when(teacherWishesRepository.countWishesByTeacherId(1L)).thenReturn(1L);

        teacherWishesService.save(teacherWishes);
        verify(teacherWishesRepository, times(1)).save(teacherWishes);
        verify(teacherWishesRepository, times(1)).countWishesByTeacherId(1L);
    }

    @Test(expected = IncorrectWishException.class)
    public void whenClassesAreNotUnique() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        Wish anotherWish = new Wish();
        anotherWish.setClassId(1L);
        anotherWish.setStatus("bad");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        wishList.add(anotherWish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("EVEN");
        wishes.setWishes(wishList);
        Wishes anotherWishes = new Wishes();
        anotherWishes.setWishes(wishList);
        anotherWishes.setDayOfWeek("Monday");
        anotherWishes.setEvenOdd("ODD");
        Wishes[] wishesArray = {wishes, anotherWishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);

        when(teacherWishesRepository.countWishesByTeacherId(1L)).thenReturn(0L);

        teacherWishesService.save(teacherWishes);
        verify(teacherWishesRepository, times(1)).save(teacherWishes);
        verify(teacherWishesRepository, times(1)).countWishesByTeacherId(1L);
    }

    @Test(expected = IncorrectWishException.class)
    public void whenNotUniqueDayAndEvenOdd() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        Wish anotherWish = new Wish();
        anotherWish.setClassId(2L);
        anotherWish.setStatus("bad");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        wishList.add(anotherWish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("WEEKLY");
        wishes.setWishes(wishList);
        Wishes anotherWishes = new Wishes();
        anotherWishes.setWishes(wishList);
        anotherWishes.setDayOfWeek("Monday");
        anotherWishes.setEvenOdd("WEEKLY");
        Wishes[] wishesArray = {wishes, anotherWishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);

        when(teacherWishesRepository.countWishesByTeacherId(1L)).thenReturn(0L);

        teacherWishesService.save(teacherWishes);
        verify(teacherWishesRepository, times(1)).save(teacherWishes);
        verify(teacherWishesRepository, times(1)).countWishesByTeacherId(1L);
    }

    @Test(expected = IncorrectWishException.class)
    public void whenEvenOrOddTogetherWithWeekly() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("EVEN");
        Wishes anotherWishes = new Wishes();
        anotherWishes.setWishes(wishList);
        anotherWishes.setDayOfWeek("Monday");
        anotherWishes.setEvenOdd("WEEKLY");
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes, anotherWishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);

        when(teacherWishesRepository.countWishesByTeacherId(1L)).thenReturn(0L);

        teacherWishesService.save(teacherWishes);
        verify(teacherWishesRepository, times(1)).save(teacherWishes);
        verify(teacherWishesRepository, times(1)).countWishesByTeacherId(1L);
    }

    @Test
    public void testUpdate() {
        Wish wish = new Wish();
        wish.setClassId(1L);
        wish.setStatus("good");
        List<Wish> wishList = new ArrayList<>();
        wishList.add(wish);
        Wishes wishes = new Wishes();
        wishes.setDayOfWeek("Monday");
        wishes.setEvenOdd("EVEN");
        wishes.setWishes(wishList);
        Wishes[] wishesArray = {wishes};
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        TeacherWishes teacherWishes = new TeacherWishes();
        teacherWishes.setId(1L);
        teacherWishes.setTeacher(teacher);
        teacherWishes.setTeacherWishesList(wishesArray);


        when(teacherWishesRepository.update(teacherWishes)).thenReturn(teacherWishes);

        TeacherWishes result = teacherWishesService.update(teacherWishes);
        assertNotNull(result);
        assertEquals(result, teacherWishes);
        verify(teacherWishesRepository, times(1)).update(teacherWishes);
    }
}
