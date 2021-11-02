import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions';
import '../../helper/renderStudentTable.scss';
import MovingGroupsDialog from '../../share/DialogWindows/_dialogWindows/MovingGroupsDialog';
import { StudentsTable } from './StudentsTable';
import { deleteStudentStart, selectStudentSuccess } from '../../actions/students';

const StudentsPage = (props) => {
    const { group, groups, isOpenStudentListDialog, setIsOpenStudentListDialog, ...rest } = props;

    const [checkBoxStudents, setCheckBoxStudents] = useState([]);

    return (
        <>
            <StudentsTable
                setCheckBoxStudents={setCheckBoxStudents}
                groups={groups}
                group={group}
                {...rest}
            />
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

const mapDispatchToProps = { setIsOpenConfirmDialog, deleteStudentStart, selectStudentSuccess };

export default connect(mapStateToProps, mapDispatchToProps)(StudentsPage);
