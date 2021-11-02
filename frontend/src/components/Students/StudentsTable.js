import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import '../../helper/renderStudentTable.scss';
import { makeStyles } from '@material-ui/core/styles';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import AddStudentDialog from '../../containers/Students/AddStudentDialog';

import { TableFooterComponent } from '../Table/TableFooter';
import { StudentsTableBody } from './StudentsTableBody';
import { StudentsTableHead } from './StudentsTableHead';

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export const StudentsTable = (props) => {
    const {
        group,
        setIsOpenConfirmDialog,
        isOpenConfirmDialog,
        deleteStudentStart,
        selectStudentSuccess,
    } = props;
    const classes = useStyles2();

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
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='custom pagination table'>
                    <StudentsTableHead {...props} />
                    <StudentsTableBody
                        setStudent={setStudent}
                        selectStudentSuccess={selectStudentSuccess}
                        setIsOpenUpdateDialog={setIsOpenUpdateDialog}
                        {...props}
                    />
                    <TableFooterComponent {...props} />
                </Table>
            </TableContainer>
            {isOpenUpdateDialog && (
                <AddStudentDialog
                    setOpen={closeEditStudentDialog}
                    open={isOpenUpdateDialog}
                    student={student}
                    group={group}
                />
            )}
            <CustomDialog
                type={dialogTypes.DELETE_CONFIRM}
                whatDelete='student'
                open={isOpenConfirmDialog}
                handelConfirm={() => confirmDeleteStudent(student.id)}
            />
        </>
    );
};
