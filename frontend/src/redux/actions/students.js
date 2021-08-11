import * as actionTypes from './actionsType';

export const addStudent = res => {
    return {
        type: actionTypes.ADD_STUDENT,
        result: res
    };
};
export const showAllStudents=res=>{
    return{
        type:actionTypes.SHOW_ALL_STUDENTS,
        result:res
    };
}
export const showAllStudentsByGroupId=res=>{
    return{
        type:actionTypes.SHOW_ALL_STUDENTS_BY_GROUP_ID,
        result:res
    };
}
export const deleteStudent=res=>{
    return{
        type:actionTypes.DELETE_STUDENT,
        result:res
    }
}
export const setStudent=res=>{
    return{
        type:actionTypes.SET_STUDENT,
        result:res
    }
}
export const updateStudent = res => {
    return {
        type: actionTypes.UPDATE_STUDENT,
        result: res
    };
};