
import * as actionsType from './actionsType';

export const addTeacher = teacher => {
	return {
		type: actionsType.ADD_TEACHER,
		result: teacher
	};
};

export const deleteTeacher = id => {
	return {
		type: actionsType.DELETE_TEACHER,
		result: id
	};
};

export const selectTeacherCard = res => {
	return {
		type: actionsType.SELECT_TEACHER,
		result: res
	};
};

export const updateTeacherCard = res => {
	return {
		type: actionsType.UPDATE_TEACHER,
		result: res
	};
};

export const showAllTeachers = teachers => {
	return {
		type: actionsType.SHOW_ALL,
		result: teachers
	};
};

export const setDisabledTeachers = teachers => {
	return {
		type: actionsType.SET_DISABLED_TEACHERS,
		result: teachers
	};
};
