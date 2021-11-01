import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { selectStudentService } from '../../services/studentService';
import { setIsOpenConfirmDialog } from '../../actions';
import '../../helper/renderStudentTable.scss';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import AddStudentDialog from '../../containers/Students/AddStudentDialog';
import MovingGroupsDialog from '../../share/DialogWindows/_dialogWindows/MovingGroupsDialog';
import { StudentsTable } from './StudentsTable';

const StudentsList = (props) => {
    const {
        group,
        groups,
        onDeleteStudent,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        isOpenStudentListDialog,
        setIsOpenStudentListDialog,
        ...rest
    } = props;
    const [student, setStudent] = useState(0);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [checkBoxStudents, setCheckBoxStudents] = useState([]);

    const deleteStudent = (studentItem) => {
        setOpenConfirmDialog(false);
        onDeleteStudent(studentItem);
    };
    const handleCloseEditDialog = () => {
        setIsOpenEditDialog(false);
        selectStudentService(null);
    };

    return (
        <>
            <StudentsTable groups={groups} group={group} {...rest} />
            <CustomDialog
                type={dialogTypes.DELETE_CONFIRM}
                whatDelete='student'
                open={isOpenConfirmDialog}
                handelConfirm={() => deleteStudent(student)}
            />
            {isOpenEditDialog && (
                <AddStudentDialog
                    open={isOpenEditDialog}
                    student={student}
                    group={group}
                    setOpen={handleCloseEditDialog}
                />
            )}
            {isOpenStudentListDialog && (
                <MovingGroupsDialog
                    onClose={() => setIsOpenStudentListDialog(false)}
                    open={isOpenStudentListDialog}
                    checkBoxStudents={checkBoxStudents}
                    setShowStudentList={setIsOpenStudentListDialog}
                    groups={groups}
                    group={group}
                />
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    student: state.students.student,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);
