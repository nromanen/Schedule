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

    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [student, setStudent] = useState(0);

    const deleteStudent = (studentItem) => {
        setIsOpenConfirmDialog(false);
        deleteStudentStart(studentItem);
    };
    const closeEditDialog = () => {
        setIsOpenEditDialog(false);
        selectStudentSuccess(null);
    };
    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <StudentsTableHead {...props} />
                    <StudentsTableBody {...props} />
                    <TableFooterComponent {...props} />
                </Table>
            </TableContainer>
            {isOpenEditDialog && (
                <AddStudentDialog
                    open={isOpenEditDialog}
                    student={student}
                    group={group}
                    setOpen={closeEditDialog}
                />
            )}
            <CustomDialog
                type={dialogTypes.DELETE_CONFIRM}
                whatDelete="student"
                open={isOpenConfirmDialog}
                handelConfirm={() => deleteStudent(student)}
            />
        </>
    );
};
