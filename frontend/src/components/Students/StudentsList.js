import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions';
import '../../helper/renderStudentTable.scss';
import MovingGroupsDialog from '../../share/DialogWindows/_dialogWindows/MovingGroupsDialog';
import { StudentsTable } from './StudentsTable';
import { deleteStudentStart, selectStudentSuccess } from '../../actions/students';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import AddStudentDialog from '../../containers/Students/AddStudentDialog';

const StudentsPage = (props) => {
    const {
        group,
        groups,
        isOpenConfirmDialog,
        isOpenStudentListDialog,
        setIsOpenStudentListDialog,
        ...rest
    } = props;

    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [student, setStudent] = useState(0);

    const confirmDeleteStudent = (studentId) => {
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
                setCheckBoxStudents={setCheckBoxStudents}
                setStudent={setStudent}
                groups={groups}
                group={group}
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
                    group={group}
                    student={student}
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

const mapStateToProps = (state) => ({
    student: state.students.student,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

const mapDispatchToProps = { setIsOpenConfirmDialog, deleteStudentStart, selectStudentSuccess };

export default connect(mapStateToProps, mapDispatchToProps)(StudentsPage);
