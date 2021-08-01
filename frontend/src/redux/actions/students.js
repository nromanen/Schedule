import * as actionTypes from './actionsType';

export const addStudent = res => {
    return {
        type: actionTypes.ADD_STUDENT,
        result: res
    };
};
export const showAllStudentsByGroupId=res=>{
    return{
        type:actionTypes.SHOW_ALL_STUDENTS_BY_GROUP_ID,
        result:res
    };
}
export const deleteStudent=res=>{
    return{
        type:actionTypes.DELETE_STUDENT,
        return:res
    }
}