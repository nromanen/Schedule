import React, { useState } from 'react';
import MovingGroupsDialog from '../../share/DialogWindows/_dialogWindows/MovingGroupsDialog';
import { StudentsTable } from './StudentsTable';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import AddStudentDialog from '../../share/DialogWindows/_dialogWindows/AddStudentDialog';
import { STUDENT } from '../../constants/names';

export const StudentsPage = (props) => {
    const {
        group,
        groups,
        students,
        deleteStudentStart,
        isOpenConfirmDialog,
        updateStudentSuccess,
        selectStudentSuccess,
        setIsOpenConfirmDialog,
        checkAllStudentsSuccess,
        isOpenMoveStudentsDialog,
        moveStudentsToGroupStart,
        setIsOpenMoveStudentDialog,
    } = props;

    const [student, setStudent] = useState(0);
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);

    const confirmDeleteStudent = (studentId) => {
        setIsOpenConfirmDialog(false);
        deleteStudentStart(studentId);
    };
    const closeAddStudentDialog = () => {
        setIsOpenUpdateDialog(false);
        selectStudentSuccess(null);
    };

    return (
        <>
            <StudentsTable
                group={group}
                groups={groups}
                students={students}
                setStudent={setStudent}
                selectStudentSuccess={selectStudentSuccess}
                updateStudentSuccess={updateStudentSuccess}
                setIsOpenUpdateDialog={setIsOpenUpdateDialog}
                setIsOpenConfirmDialog={setIsOpenConfirmDialog}
                checkAllStudentsSuccess={checkAllStudentsSuccess}
                {...props}
            />
            {isOpenMoveStudentsDialog && (
                <MovingGroupsDialog
                    group={group}
                    groups={groups}
                    open={isOpenMoveStudentsDialog}
                    checkBoxStudents={students}
                    onClose={() => setIsOpenMoveStudentDialog(false)}
                    moveStudentsToGroupStart={moveStudentsToGroupStart}
                />
            )}
            {isOpenUpdateDialog && (
                <AddStudentDialog
                    groupId={group.id}
                    open={isOpenUpdateDialog}
                    setOpen={closeAddStudentDialog}
                />
            )}
            <CustomDialog
                whatDelete={STUDENT}
                open={isOpenConfirmDialog}
                type={dialogTypes.DELETE_CONFIRM}
                handelConfirm={() => confirmDeleteStudent(student.id)}
            />
        </>
    );
};
