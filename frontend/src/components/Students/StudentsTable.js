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
        students,
        setIsOpenConfirmDialog,
        isOpenConfirmDialog,
        deleteStudentStart,
        selectStudentSuccess,
    } = props;
    const classes = useStyles2();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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
                <Table className={classes.table} aria-label="custom pagination table">
                    <StudentsTableHead {...props} />
                    <StudentsTableBody
                        page={page}
                        students={students}
                        rowsPerPage={rowsPerPage}
                        setStudent={setStudent}
                        selectStudentSuccess={selectStudentSuccess}
                        setIsOpenUpdateDialog={setIsOpenUpdateDialog}
                        {...props}
                    />
                    <TableFooterComponent
                        page={page}
                        items={students}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                </Table>
            </TableContainer>
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
