import React, { useState } from 'react';
import MovingGroupsDialog from '../../share/DialogWindows/_dialogWindows/MovingGroupsDialog';
import { StudentsTable } from './StudentsTable';
import { deleteStudentStart, selectStudentSuccess } from '../../actions/students';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import AddStudentDialog from '../../share/DialogWindows/_dialogWindows/AddStudentDialog';

export const StudentsPage = (props) => {
    const {
        group,
        groups,
        isOpenConfirmDialog,
        setIsOpenConfirmDialog,
        isOpenStudentListDialog,
        setIsOpenStudentListDialog,
        ...rest
    } = props;

    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [student, setStudent] = useState(0);

    const confirmDeleteStudent = (studentId) => {
        console.log(studentId);
        setIsOpenConfirmDialog(false);
        deleteStudentStart(studentId);
    };
    const closeEditStudentDialog = () => {
        setIsOpenUpdateDialog(false);
        selectStudentSuccess(null);
    };

    return (
        <>
            <StudentsTable
                group={group}
                groups={groups}
                setStudent={setStudent}
                checkBoxStudents={checkBoxStudents}
                setCheckBoxStudents={setCheckBoxStudents}
                setIsOpenUpdateDialog={setIsOpenUpdateDialog}
                setIsOpenStudentListDialog={setIsOpenStudentListDialog}
                {...rest}
            />
            {isOpenStudentListDialog && (
                <MovingGroupsDialog
                    group={group}
                    groups={groups}
                    open={isOpenStudentListDialog}
                    checkBoxStudents={checkBoxStudents}
                    setShowStudentList={setIsOpenStudentListDialog}
                    onClose={() => setIsOpenStudentListDialog(false)}
                />
            )}
            {isOpenUpdateDialog && (
                <AddStudentDialog
                    student={student}
                    groupId={group.id}
                    open={isOpenUpdateDialog}
                    setOpen={closeEditStudentDialog}
                />
            )}
            <CustomDialog
                whatDelete="student"
                open={isOpenConfirmDialog}
                type={dialogTypes.DELETE_CONFIRM}
                handelConfirm={() => confirmDeleteStudent(student.id)}
            />
        </>
    );
};
